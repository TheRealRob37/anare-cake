import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus, NotFoundError } from "@/services/orders";
import { sendOrderConfirmedEmail } from "@/lib/email";

// POST /api/orders/:id/pay
// Called after the customer completes payment on the tracking page.
// In production, integrate real payment gateway here before updating status.

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await getOrderById(params.id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "confirmed") {
      return NextResponse.json(
        { error: `Payment not available — order status is "${order.status}". Order must be confirmed first.` },
        { status: 409 }
      );
    }

    // TODO: Integrate real payment gateway here (Stripe, IDBank, etc.)
    // const paymentResult = await processPayment(body.paymentToken, order.total_price);
    // if (!paymentResult.success) return NextResponse.json({ error: "Payment failed" }, { status: 402 });

    const updated = await updateOrderStatus(params.id, "in_progress");
    return NextResponse.json({ order: updated });
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error("[POST /api/orders/:id/pay]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
