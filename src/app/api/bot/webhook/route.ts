import { NextRequest, NextResponse } from "next/server";
import { getBot, registerBotHandlers } from "@/bot/telegram";

// POST /api/bot/webhook
// Receives webhook updates from Telegram.
//
// Setup: after deploying, run once in your browser or curl:
//   POST https://api.telegram.org/bot<TOKEN>/setWebhook
//   Body: { "url": "https://yourdomain.com/api/bot/webhook" }
//
// Or use ngrok during development and set the webhook to your tunnel URL.

let handlersRegistered = false;

export async function POST(req: NextRequest) {
  const bot = getBot();
  if (!bot) {
    return NextResponse.json({ error: "Bot not configured (missing TELEGRAM_BOT_TOKEN)" }, { status: 503 });
  }

  // Register handlers once
  if (!handlersRegistered) {
    const { registerBotHandlers: register } = await import("@/bot/telegram");
    register(bot);
    handlersRegistered = true;
  }

  const body = await req.json();

  try {
    await bot.handleUpdate(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[bot/webhook]", err);
    return NextResponse.json({ error: "Update processing failed" }, { status: 500 });
  }
}

// Re-register handlers on each cold start
export async function GET() {
  const bot = getBot();
  if (!bot) {
    return NextResponse.json({ configured: false });
  }
  if (!handlersRegistered) {
    registerBotHandlers(bot);
    handlersRegistered = true;
  }
  return NextResponse.json({ configured: true });
}
