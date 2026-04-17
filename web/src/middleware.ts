import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (pathname.startsWith("/api/produtos") || pathname.startsWith("/api/compras")) {
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Utilizador não autenticado" },
        { status: 401 }
      );
    }
  }

  const privatePages = ["/checkout", "/perfil"];
  const isPrivatePage = privatePages.some(page => pathname.startsWith(page));

  if (isPrivatePage && !session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
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