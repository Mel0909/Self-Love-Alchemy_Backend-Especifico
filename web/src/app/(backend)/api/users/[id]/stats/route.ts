import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/utils/handleError";
import { auth } from "@/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const comprasUser = await prisma.compra.findMany({
      where: {
        userId: params.id,
        status: { in: ["paid", "shipped", "delivered"] } 
      },
      include: {
        produtos: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    const totalGasto = comprasUser.reduce((acc, compra) => acc + compra.precoTotal, 0);

    const numeroCompras = comprasUser.length;

    const contagemProdutos: Record<string, { nome: string; qtd: number }> = {};

    comprasUser.forEach((compra) => {
      compra.produtos.forEach((produto) => {
        if (!contagemProdutos[produto.id]) {
          contagemProdutos[produto.id] = { nome: produto.nome, qtd: 0 };
        }
        contagemProdutos[produto.id].qtd += 1;
      });
    });

    let produtoMaisComprado = "Nenhum produto comprado";
    let maxQtd = 0;

    Object.values(contagemProdutos).forEach((p) => {
      if (p.qtd > maxQtd) {
        maxQtd = p.qtd;
        produtoMaisComprado = p.nome;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalGasto: Number(totalGasto.toFixed(2)),
        numeroCompras,
        produtoMaisComprado
      }
    });

  } catch (error) {
    return handleError(error);
  }
}