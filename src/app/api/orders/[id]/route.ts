import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { updateOrderStatus, getOrderById, NotFoundError } from "@/services/orders";
import { UpdateOrderSchema } from "@/lib/validations/order";
import {
  sendOrderConfirmedEmail,
  sendOrderDoneEmail,
  sendAwaitingPaymentEmail,
} from "@/lib/email";

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (err) {
    console.error("[GET /api/orders/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── PATCH /api/orders/:id ────────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body       = await req.json();
    const { status } = UpdateOrderSchema.parse(body);

    // When manually approving from staff dashboard → set the 15-minute payment window
    const extra =
      status === "awaiting_payment"
        ? { payment_expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() }
        : undefined;

    const order = await updateOrderStatus(params.id, status, extra);

    // Email notifications on key status transitions
    if (status === "awaiting_payment") sendAwaitingPaymentEmail(order);
    if (status === "confirmed")        sendOrderConfirmedEmail(order);
    if (status === "done")             sendOrderDoneEmail(order);

    return NextResponse.json({ order });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten() },
        { status: 400 }
      );
    }
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error("[PATCH /api/orders/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
