import { NextRequest, NextResponse } from "next/server";

const STAFF_COOKIE = "anare_staff_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /staff routes except /staff/login
  if (pathname.startsWith("/staff") && !pathname.startsWith("/staff/login")) {
    const session = req.cookies.get(STAFF_COOKIE)?.value;

    if (session !== process.env.STAFF_SESSION_TOKEN) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/staff/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Explicitly list /staff AND /staff/:path* — Next.js 14 :path* does not
  // reliably match the bare /staff path without a trailing segment.
  matcher: ["/staff", "/staff/:path+"],
};
