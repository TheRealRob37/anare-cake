import { NextResponse } from "next/server";
import { cancelExpiredOrders } from "@/services/orders";

// GET /api/reaper
// Cancels any awaiting_payment orders whose payment_expires_at has passed.
// Called automatically when the /configurator page loads, so the next
// customer always sees accurate availability.
//
// This is a lightweight, idempotent operation — safe to call frequently.
// No auth required: it only sets already-expired orders to "cancelled".

export async function GET() {
  try {
    const cancelled = await cancelExpiredOrders();
    return NextResponse.json({ cancelled });
  } catch (err) {
    console.error("[reaper]", err);
    return NextResponse.json({ error: "Reaper failed" }, { status: 500 });
  }
}
