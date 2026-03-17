import { NextRequest, NextResponse } from "next/server";

const STAFF_COOKIE  = "anare_staff_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const correct = process.env.STAFF_PASSWORD;
  const token   = process.env.STAFF_SESSION_TOKEN;

  if (!correct || !token) {
    return NextResponse.json(
      { error: "Staff login is not configured on this server." },
      { status: 503 }
    );
  }

  if (password !== correct) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(STAFF_COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   COOKIE_MAX_AGE,
    path:     "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(STAFF_COOKIE);
  return res;
}
