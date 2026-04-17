import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ carrinho: [] });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { carrinhoJson: true }
  });

  return NextResponse.json({ 
    carrinho: user?.carrinhoJson ? JSON.parse(user.carrinhoJson) : [] 
  });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Não logado" }, { status: 401 });

  const { carrinho } = await req.json();

  await prisma.user.update({
    where: { id: session.user.id },
    data: { carrinhoJson: JSON.stringify(carrinho) }
  });

  return NextResponse.json({ success: true });
}