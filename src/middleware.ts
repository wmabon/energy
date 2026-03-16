import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token");
  const isLoggedIn = !!token;
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isAuthApi = req.nextUrl.pathname.startsWith("/api/auth");
  const isPublicAsset = req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname === "/favicon.ico" || req.nextUrl.pathname === "/manifest.json";

  if (isAuthApi || isPublicAsset) {
    return NextResponse.next();
  }

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/today", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
