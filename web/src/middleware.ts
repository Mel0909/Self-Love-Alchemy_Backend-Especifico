import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const sessionToken = request.cookies.get("better-auth.session_token")?.value;
  const hasSession = !!sessionToken;

  if (pathname.startsWith("/api/produtos") || pathname.startsWith("/api/compras")) {
    
    if (pathname === "/api/produtos" && method === "GET") {
      return NextResponse.next();
    }

    if (!hasSession) {
      return NextResponse.json(
        { success: false, message: "Utilizador não autenticado" },
        { status: 401 }
      );
    }
  }

  const privatePages = ["/checkout", "/perfil"];
  if (privatePages.some(page => pathname.startsWith(page)) && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/produtos/:path*",
    "/api/compras/:path*",
    "/checkout/:path*",
    "/perfil/:path*",
  ],
};