import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set([
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/invitations/preview",
]);

const AUTH_ROUTES = new Set(["/login", "/register", "/forgot-password", "/reset-password"]);

function isPublic(pathname: string): boolean {
  for (const route of PUBLIC_ROUTES) {
    if (pathname === route || pathname.startsWith(`${route}/`)) return true;
  }
  return false;
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.has(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* The refresh token lives in localStorage (client-side only).
     Middleware can only inspect cookies. We use a lightweight session
     cookie ("irb_session") set by the AuthProvider on mount to signal
     the middleware that a session may exist. This is a hint only —
     the actual token refresh happens client-side. */
  const hasSessionHint = request.cookies.has("irb_session");

  /* Unauthenticated user trying to access a protected route */
  if (!isPublic(pathname) && !hasSessionHint) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  /* Authenticated user trying to access auth pages → send to dashboard */
  if (isAuthRoute(pathname) && hasSessionHint) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.searchParams.delete("redirect");
    return NextResponse.redirect(url);
  }

  /* Root redirect */
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = hasSessionHint ? "/dashboard" : "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
