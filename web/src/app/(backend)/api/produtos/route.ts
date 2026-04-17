import { NextResponse } from "next/server";
import { ProdutoService } from "@/app/(backend)/services/ProdutoService";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        categorias: true,
      },
    });
    return NextResponse.json(produtos);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar poções" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (Array.isArray(body)) {
      const produtosCriados = await ProdutoService.criarEmLote(body);
      return NextResponse.json(produtosCriados, { status: 201 });
    }

    const novoProduto = await ProdutoService.criarEmLote([body]);
    return NextResponse.json(novoProduto[0], { status: 201 });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
