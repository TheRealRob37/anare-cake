import { NextRequest, NextResponse } from "next/server";

const STAFF_COOKIE = "anare_staff_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/staff") && !pathname.startsWith("/staff/login")) {
    const session = req.cookies.get(STAFF_COOKIE)?.value;
    const token   = process.env.STAFF_SESSION_TOKEN;

    // Fail CLOSED: if the env var is missing OR the cookie doesn't match → redirect.
    // Previously: `session !== token` → when both are undefined this is false → open door.
    const valid = token && session && session === token;

    if (!valid) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/staff/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff", "/staff/:path+"],
};
