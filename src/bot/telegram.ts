import { Telegraf, Markup } from "telegraf";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Order } from "@/types/order";

// ─── Singleton bot instance ───────────────────────────────────────────────────
// Initialized lazily — only when TELEGRAM_BOT_TOKEN is set.

let _bot: Telegraf | null = null;

export function getBot(): Telegraf | null {
  if (!process.env.TELEGRAM_BOT_TOKEN) return null;
  if (!_bot) _bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
  return _bot;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAMD(amount: number): string {
  return `${amount.toLocaleString()} AMD`;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function yandexMapsLink(lat: number | null, lng: number | null, address: string): string {
  if (lat && lng) {
    return `https://maps.yandex.ru/?pt=${lng},${lat}&z=16&l=map`;
  }
  return `https://maps.yandex.ru/?text=${encodeURIComponent(address)}`;
}

// ─── Order notification ───────────────────────────────────────────────────────
// Called by the Supabase webhook or POST /api/orders when a new order is placed.
// Sends a rich message to the manager's chat with inline keyboard.

export async function notifyNewOrder(order: Order): Promise<void> {
  const bot     = getBot();
  const chatId  = process.env.TELEGRAM_MANAGER_CHAT_ID;

  if (!bot || !chatId) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfg = order.cake_config as any;

  const isComplex  = order.complexity_score >= 4;
  const isLargeCake = cfg?.size === "25cm"; // 30+ person cakes — phone call acceptable

  const trackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/track/${order.id}`;
  const mapsUrl  = yandexMapsLink(order.delivery_lat, order.delivery_lng, order.delivery_address);

  const lines = [
    `🎂 <b>New Order</b> — #${order.id.slice(0, 8).toUpperCase()}`,
    ``,
    `👤 <b>${order.customer_name}</b>`,
    `📞 <a href="tel:${order.customer_phone}">${order.customer_phone}</a>`,
    ``,
    `🎂 ${cfg?.size ?? "?"} · ${cfg?.tiers ?? "?"}T · ${cfg?.shape ?? "?"}`,
    `   Sponge: ${cfg?.sponge ?? "?"}`,
    `   Frosting: ${cfg?.frosting ?? "?"}`,
    `   Fillings: ${(cfg?.fillings ?? []).join(", ")}`,
    `   Toppings: ${(cfg?.toppings ?? []).length > 0 ? (cfg?.toppings ?? []).join(", ") : "none"}`,
    ``,
    `📅 Delivery: <b>${formatDateTime(order.delivery_date)}</b>`,
    `📍 <a href="${mapsUrl}">${order.delivery_address}</a>`,
    ``,
    `💰 <b>${formatAMD(order.total_price)}</b>`,
    ``,
    isComplex
      ? `⚠️ <b>COMPLEX ORDER</b> (score: ${order.complexity_score}/10)`
      : `✅ Standard order`,
    isLargeCake
      ? `📞 <i>Large cake (30+ people) — phone call approval acceptable</i>`
      : "",
    ``,
    `🔗 <a href="${trackUrl}">Track page</a>`,
    order.notes ? `\n📝 Notes: ${order.notes}` : "",
  ].filter((l) => l !== "");

  await bot.telegram.sendMessage(chatId, lines.join("\n"), {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback("✅ Approve", `approve:${order.id}`),
        Markup.button.callback("❌ Reject",  `reject:${order.id}`),
      ],
      [
        Markup.button.callback("💬 Message Customer", `msg:${order.id}`),
      ],
    ]),
  });
}

// ─── Callback query handlers ──────────────────────────────────────────────────

export function registerBotHandlers(bot: Telegraf): void {
  // [Approve] → set awaiting_payment + start 15-min payment timer
  bot.action(/^approve:(.+)$/, async (ctx) => {
    const orderId = ctx.match[1];
    await ctx.answerCbQuery("Processing…");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/${orderId}`,
        {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ status: "awaiting_payment" }),
        }
      );

      if (!res.ok) {
        await ctx.editMessageText(`❌ Failed to approve order ${orderId.slice(0, 8).toUpperCase()}`);
        return;
      }

      await ctx.editMessageText(
        `✅ Order #${orderId.slice(0, 8).toUpperCase()} approved.\n` +
        `Payment link sent to customer. Slot reserved for 15 minutes.`
      );
    } catch (err) {
      console.error("[bot approve]", err);
      await ctx.editMessageText("❌ Server error — please try again.");
    }
  });

  // [Reject] → set cancelled
  bot.action(/^reject:(.+)$/, async (ctx) => {
    const orderId = ctx.match[1];
    await ctx.answerCbQuery("Cancelling…");

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/${orderId}`,
        {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ status: "cancelled" }),
        }
      );

      await ctx.editMessageText(
        `❌ Order #${orderId.slice(0, 8).toUpperCase()} rejected and cancelled.`
      );
    } catch {
      await ctx.editMessageText("❌ Server error — please try again.");
    }
  });

  // [Message Customer] → prompt manager to type a message
  bot.action(/^msg:(.+)$/, async (ctx) => {
    const orderId = ctx.match[1];
    await ctx.answerCbQuery();

    // Store orderId in session-like state via reply
    await ctx.reply(
      `✏️ Reply to this message with the text you want to send to the customer.\n` +
      `Order: #${orderId.slice(0, 8).toUpperCase()}\n\n` +
      `(Feature: save this message to the order's notes field via API)`,
      { reply_markup: { force_reply: true } }
    );
  });

  // Handle force_reply messages from manager → post to order notes
  bot.on("message", async (ctx) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = ctx.message as any;
    if (!msg.reply_to_message) return;

    const replyText: string = msg.reply_to_message.text ?? "";
    const match = replyText.match(/Order: #([A-F0-9]{8})/i);
    if (!match) return;

    // Find the full order ID by prefix
    const shortId = match[1].toLowerCase();
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from("orders")
      .select("id, notes, customer_name")
      .ilike("id", `${shortId}%`)
      .limit(1)
      .single();

    if (!data) {
      await ctx.reply("❌ Could not find that order.");
      return;
    }

    // Append message to notes (simple implementation — extend with a chat_messages table later)
    const managerMessage: string = msg.text ?? "";
    const updatedNotes = [
      data.notes ?? "",
      `[Manager → ${data.customer_name}]: ${managerMessage}`,
    ]
      .filter(Boolean)
      .join("\n");

    await supabase
      .from("orders")
      .update({ notes: updatedNotes, updated_at: new Date().toISOString() })
      .eq("id", data.id);

    await ctx.reply(`✅ Message saved to order #${data.id.slice(0, 8).toUpperCase()}.\nCustomer will see it on their tracking page.`);
  });
}
