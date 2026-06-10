import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/signin", "/signup", "/_next", "/favicon.ico", "/api"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Try to get token from cookies (server-side only)
  const cookieToken = request.cookies.get("access_token")?.value;
  // Try to get token from Authorization header (for API calls, not browser navigation)
  const headerToken = request.headers
    .get("authorization")
    ?.replace("Bearer ", "");
  // Use cookieToken for browser navigation
  const token = cookieToken || headerToken;

  // Allow public paths (login/signup/static/api)
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If not authenticated, redirect to signin
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // If authenticated and trying to access signin/signup, redirect to dashboard
  if ((pathname === "/signin" || pathname === "/signup") && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
