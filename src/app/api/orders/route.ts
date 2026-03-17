import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createOrder, getOrders, SlotFullError } from "@/services/orders";
import { CreateOrderSchema, OrdersQuerySchema } from "@/lib/validations/order";
import { sendOrderReceivedEmail } from "@/lib/email";
import { notifyNewOrder } from "@/bot/telegram";

// ─── GET /api/orders ──────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const query = OrdersQuerySchema.parse({
      date:   searchParams.get("date")   ?? undefined,
      status: searchParams.get("status") ?? undefined,
    });

    const orders = await getOrders(query);
    return NextResponse.json({ orders });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: err.flatten() },
        { status: 400 }
      );
    }
    console.error("[GET /api/orders]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── POST /api/orders ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json();
    const input = CreateOrderSchema.parse(body);
    const order = await createOrder(input);

    // Fire-and-forget — don't block the response
    sendOrderReceivedEmail(order);
    notifyNewOrder(order).catch(console.error); // Telegram manager notification

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten() },
        { status: 400 }
      );
    }
    if (err instanceof SlotFullError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("[POST /api/orders]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
