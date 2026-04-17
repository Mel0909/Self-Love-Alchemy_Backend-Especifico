import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/app/(backend)/schemas/compra.schema";
import { handleError } from "@/utils/handleError";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { produtoIDs } = checkoutSchema.parse(body);

    const produtosNoBanco = await prisma.produto.findMany({
      where: {
        id: { in: produtoIDs }
      },
      select: { preco: true }
    });

    if (produtosNoBanco.length === 0) {
      throw new Error("Nenhum produto válido encontrado");
    }

    const precoTotal = produtosNoBanco.reduce((acc, prod) => acc + prod.preco, 0);

    const novaCompra = await prisma.compra.create({
      data: {
        precoTotal,
        status: "pending",
        userId: session.user.id,
        produtoIDs: produtoIDs,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Compra realizada com sucesso", 
        data: novaCompra 
      }, 
      { status: 201 }
    );

  } catch (error) {
    return handleError(error);
  }
}