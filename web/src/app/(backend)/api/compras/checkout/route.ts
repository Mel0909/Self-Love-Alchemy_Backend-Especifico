// src/app/api/compras/checkout/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { CompraService } from "../../../services/compra.service";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Sessão expirada ou usuário não logado" }, { status: 401 });
    }

    const { itens } = await req.json();

    if (!itens || itens.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    const novaCompra = await CompraService.efetivarCompra(session.user.id, itens);

    return NextResponse.json(novaCompra, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao processar checkout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}