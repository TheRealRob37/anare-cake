// ─── Temporal Engine ─────────────────────────────────────────────────────────
// Implements all PM Hard Constraints for the date picker:
//   1. Lead time: Simple = +2 days, Complex = +5 days
//   2. Monday 13:00 rule: if today is Monday past 13:00, disable tomorrow (Tuesday)
//   3. 15-cake daily limit: disabled dates returned as ISO date strings

// ─── Complexity score ─────────────────────────────────────────────────────────
// Calculated from the cake config submitted by the customer.
// Used both in the UI (to determine minDate) and stored in the DB.

export interface CakeMeta {
  tiers: number;         // 1 | 2 | 3
  toppingsCount: number; // number of selected toppings
  size: string;          // "10cm" | "15cm" | "20cm" | "25cm"
}

/** Returns 0–10 complexity score. Score >= 4 → "complex". */
export function calcComplexityScore(meta: CakeMeta): number {
  let score = 0;

  // Tiers add the most complexity
  if (meta.tiers === 2) score += 3;
  if (meta.tiers === 3) score += 5;

  // Many toppings add complexity
  score += Math.min(meta.toppingsCount, 3); // cap at 3

  // Large cake size
  if (meta.size === "25cm") score += 2;

  return Math.min(score, 10);
}

export function isComplex(score: number): boolean {
  return score >= 4;
}

/** For 25cm cakes serving 30+ people, phone call approval is acceptable. */
export function isPhoneCallEligible(meta: CakeMeta): boolean {
  return meta.size === "25cm";
}

// ─── Lead time ────────────────────────────────────────────────────────────────

const SIMPLE_LEAD_DAYS  = 2;
const COMPLEX_LEAD_DAYS = 5;

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// ─── Monday 13:00 rule ────────────────────────────────────────────────────────
// If it's currently Monday AND past 13:00 local time,
// the next day (Tuesday) must be disabled.

function isMondayPast1300(now: Date): boolean {
  return now.getDay() === 1 && now.getHours() >= 13;
}

// ─── Main utility ─────────────────────────────────────────────────────────────

export interface AvailabilityResult {
  /** Earliest date the customer may select (ISO date string, e.g. "2026-03-20") */
  minDate: string;
  /** Extra disabled dates beyond minDate (e.g. Monday rule). ISO date strings. */
  extraDisabledDates: string[];
  /** Score for persistence in the DB */
  complexityScore: number;
  /** Whether this is a complex order */
  isComplex: boolean;
  /** Whether a phone call is acceptable for approval (30+ person cakes) */
  phoneCallEligible: boolean;
}

/**
 * Given the current time and the customer's cake config,
 * returns the earliest valid delivery date and any extra disabled dates.
 *
 * This runs client-side (in the configurator/checkout) to drive the date picker UI.
 * The same constraints are enforced server-side via countOrdersOnDay().
 */
export function getValidatedAvailability(
  meta: CakeMeta,
  now: Date = new Date()
): AvailabilityResult {
  const score = calcComplexityScore(meta);
  const complex = isComplex(score);
  const leadDays = complex ? COMPLEX_LEAD_DAYS : SIMPLE_LEAD_DAYS;

  const today    = toDateOnly(now);
  const minRaw   = addDays(today, leadDays);
  const extraDisabled: string[] = [];

  // Monday 13:00 rule: if today is Monday past 13:00, disable tomorrow (Tuesday)
  if (isMondayPast1300(now)) {
    const tomorrow = addDays(today, 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    // Only add to extraDisabled if it's not already beyond minDate
    if (tomorrow >= minRaw) {
      extraDisabled.push(tomorrowStr);
    }

    // If lead time would allow tomorrow, push minDate to day after tomorrow
    if (minRaw <= tomorrow) {
      minRaw.setDate(addDays(today, 2).getDate());
    }
  }

  return {
    minDate:            minRaw.toISOString().slice(0, 10),
    extraDisabledDates: extraDisabled,
    complexityScore:    score,
    isComplex:          complex,
    phoneCallEligible:  isPhoneCallEligible(meta),
  };
}

/**
 * Server-side: fetch booked dates for a month.
 * Returns ISO date strings where the 15-cake limit is reached.
 * Used to disable fully-booked dates in the calendar.
 */
export async function fetchFullyBookedDates(
  year: number,
  month: number // 1-indexed
): Promise<string[]> {
  const params = new URLSearchParams({
    year:  String(year),
    month: String(month),
  });

  const res = await fetch(`/api/availability?${params}`);
  if (!res.ok) return [];
  const { bookedDates } = await res.json();
  return bookedDates as string[];
}
