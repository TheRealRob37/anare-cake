import { Resend } from "resend";
import type { Order } from "@/types/order";

// If RESEND_API_KEY is not set — skip silently (dev mode)
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = "Anare Cake <orders@anarecake.am>";

// ─── Templates ────────────────────────────────────────────────────────────────

function baseLayout(content: string) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; background:#F5F7F4; font-family:Georgia,serif; color:#181C16; }
  .wrap { max-width:560px; margin:40px auto; background:#fff; border-radius:24px; overflow:hidden; box-shadow:0 4px 32px rgba(40,80,30,0.10); }
  .header { background:linear-gradient(135deg,#AECFA4 0%,#7DB572 50%,#559049 100%); padding:40px 40px 32px; text-align:center; }
  .header h1 { margin:0; font-size:28px; color:#fff; letter-spacing:-0.5px; }
  .header p  { margin:8px 0 0; font-size:13px; color:rgba(255,255,255,0.85); font-family:system-ui,sans-serif; }
  .body { padding:36px 40px; }
  .body h2 { font-size:20px; margin:0 0 16px; }
  .body p  { font-size:14px; line-height:1.7; color:#586050; font-family:system-ui,sans-serif; margin:0 0 12px; }
  .row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #ECF0EA; font-size:13px; font-family:system-ui,sans-serif; }
  .row .label { color:#98A090; }
  .row .value { font-weight:600; color:#181C16; }
  .btn { display:inline-block; margin:24px 0 8px; padding:14px 32px; background:linear-gradient(135deg,#AECFA4,#559049); color:#fff; border-radius:99px; text-decoration:none; font-size:14px; font-family:system-ui,sans-serif; font-weight:600; }
  .footer { padding:24px 40px; text-align:center; font-size:11px; color:#98A090; font-family:system-ui,sans-serif; border-top:1px solid #ECF0EA; }
</style>
</head>
<body><div class="wrap">${content}</div></body>
</html>`;
}

function orderRows(order: Order) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfg = order.cake_config as any;
  const date = new Date(order.delivery_date).toLocaleString("en-GB", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  const price = `${order.total_price.toLocaleString()} AMD`;

  return `
    <div class="row"><span class="label">Order ID</span><span class="value">#${order.id.slice(0,8).toUpperCase()}</span></div>
    <div class="row"><span class="label">Cake</span><span class="value">${cfg?.size ?? ""} · ${cfg?.tiers ?? ""} tier · ${cfg?.shape ?? ""}</span></div>
    <div class="row"><span class="label">Delivery</span><span class="value">${date}</span></div>
    <div class="row"><span class="label">Address</span><span class="value">${order.delivery_address}</span></div>
    <div class="row"><span class="label">Total</span><span class="value">${price}</span></div>
  `;
}

// ─── 1. Order received (sent when customer places order) ──────────────────────

export async function sendOrderReceivedEmail(order: Order) {
  if (!order.customer_email) return;
  const resend = getResend();
  if (!resend) return;

  const trackUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"}/track/${order.id}`;

  await resend.emails.send({
    from:    FROM,
    to:      order.customer_email,
    subject: `🎂 Order received — we're reviewing it now`,
    html: baseLayout(`
      <div class="header">
        <h1>🎂 Order received!</h1>
        <p>We're reviewing your order and will confirm it shortly.</p>
      </div>
      <div class="body">
        <h2>Hi ${order.customer_name},</h2>
        <p>Thank you for your order! Our team is reviewing it. You'll receive another email once it's confirmed and ready to pay.</p>
        ${orderRows(order)}
        <p style="text-align:center;margin-top:8px;">
          <a href="${trackUrl}" class="btn">Track your order →</a>
        </p>
        <p style="font-size:12px;color:#98A090;">Save this link — you can always check your order status here.</p>
      </div>
      <div class="footer">Anare Cake · Yerevan, Armenia · anarecake.am</div>
    `),
  }).catch(console.error);
}

// ─── 2. Order confirmed — pay now (sent when staff confirms) ──────────────────

export async function sendOrderConfirmedEmail(order: Order) {
  if (!order.customer_email) return;
  const resend = getResend();
  if (!resend) return;

  const trackUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"}/track/${order.id}`;

  await resend.emails.send({
    from:    FROM,
    to:      order.customer_email,
    subject: `✅ Your cake is confirmed — complete payment to proceed`,
    html: baseLayout(`
      <div class="header">
        <h1>✅ Order confirmed!</h1>
        <p>Your cake is approved. Complete payment to start baking.</p>
      </div>
      <div class="body">
        <h2>Great news, ${order.customer_name}!</h2>
        <p>Your order has been confirmed by our team. Please complete the payment to start baking your cake.</p>
        ${orderRows(order)}
        <p style="text-align:center;margin-top:8px;">
          <a href="${trackUrl}" class="btn">Pay now & track order →</a>
        </p>
      </div>
      <div class="footer">Anare Cake · Yerevan, Armenia · anarecake.am</div>
    `),
  }).catch(console.error);
}

// ─── 3. Order done ────────────────────────────────────────────────────────────

export async function sendOrderDoneEmail(order: Order) {
  if (!order.customer_email) return;
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from:    FROM,
    to:      order.customer_email,
    subject: `🎉 Your cake is on its way!`,
    html: baseLayout(`
      <div class="header">
        <h1>🎉 Your cake is delivered!</h1>
        <p>Thank you for choosing Anare Cake.</p>
      </div>
      <div class="body">
        <h2>Enjoy, ${order.customer_name}!</h2>
        <p>Your order has been completed. We hope you and your guests love every bite! 🎂</p>
        ${orderRows(order)}
        <p>We'd love to hear your feedback — feel free to tag us on Instagram.</p>
      </div>
      <div class="footer">Anare Cake · Yerevan, Armenia · anarecake.am</div>
    `),
  }).catch(console.error);
}
