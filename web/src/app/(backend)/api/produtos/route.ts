import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { produtoSchema } from "@/app/(backend)/schemas";
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
    
    const validatedData = produtoSchema.parse(body);

    const novoProduto = await prisma.produto.create({
      data: {
        nome: validatedData.nome,
        descricao: validatedData.descricao,
        preco: validatedData.preco,
        categoryIDs: validatedData.categoryIDs || [],
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Produto criado com sucesso",
        data: novoProduto 
      }, 
      { status: 201 }
    );

  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        categorias: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: produtos
    });
  } catch (error) {
    return handleError(error);
  }
}