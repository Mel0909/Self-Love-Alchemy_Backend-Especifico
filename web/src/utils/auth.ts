import { auth } from "@/auth"; 
import { NextResponse } from "next/server";

export async function checkApiSession(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  return session;
}