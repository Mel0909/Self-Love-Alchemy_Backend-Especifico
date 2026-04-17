import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token");

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/checkout") || pathname.startsWith("/perfil")) {
    if (!sessionToken) {

      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/perfil/:path*",
  ],
};