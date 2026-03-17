import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const MAX_ORDERS_PER_DAY = 15;

// GET /api/availability?year=2026&month=3
// Returns { bookedDates: ["2026-03-20", "2026-03-22", ...] }
// Booked dates = days where active order count >= 15

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const year  = parseInt(searchParams.get("year")  ?? "0");
  const month = parseInt(searchParams.get("month") ?? "0"); // 1-indexed

  if (!year || !month || month < 1 || month > 12) {
    return NextResponse.json({ error: "year and month (1–12) are required" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const now      = new Date().toISOString();

  // Start/end of the requested month
  const monthStart = new Date(year, month - 1, 1).toISOString();
  const monthEnd   = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

  // Fetch all active orders in the month
  const { data, error } = await supabase
    .from("orders")
    .select("delivery_date, status, payment_expires_at")
    .gte("delivery_date", monthStart)
    .lte("delivery_date", monthEnd);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }

  // Count per day using PM's capacity formula
  const countByDay: Record<string, number> = {};

  for (const order of data ?? []) {
    const dateKey = order.delivery_date.slice(0, 10);
    const counts =
      order.status === "confirmed"    ||
      order.status === "in_progress"  ||
      order.status === "ready"        ||
      order.status === "delivering"   ||
      order.status === "done"         ||
      (order.status === "awaiting_payment" &&
        order.payment_expires_at &&
        order.payment_expires_at > now);

    if (counts) {
      countByDay[dateKey] = (countByDay[dateKey] ?? 0) + 1;
    }
  }

  const bookedDates = Object.entries(countByDay)
    .filter(([, count]) => count >= MAX_ORDERS_PER_DAY)
    .map(([date]) => date);

  return NextResponse.json({ bookedDates });
}
