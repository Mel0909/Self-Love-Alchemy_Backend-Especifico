import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json({ error: "Você precisa de um grimório (login)!" }, { status: 401 });
    }

    const { itens, total } = await req.json();

    const novoPedido = await prisma.pedido.create({
      data: {
        userId: session.user.id,
        itens: itens,
        total: total,
        status: "PAGO"
      }
    });

    return NextResponse.json(novoPedido, { status: 201 });
  } catch (error) {
    console.error("Erro na alquimia do checkout:", error);
    return NextResponse.json({ error: "Erro ao processar pedido" }, { status: 500 });
  }
}