import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { produtoSchema } from "@/app/(backend)/schemas/produto.schema";
import { handleError } from "@/utils/handleError";
import { auth } from "@/auth";
import { uploadImageToS3 } from "@/utils/s3";


export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        categorias: true,
      },
    });

    console.log(`[GET /api/produtos] Sucesso: ${produtos.length} itens encontrados.`);

    return NextResponse.json({
      success: true,
      data: produtos,
    });
  } catch (error) {
    console.error("[GET /api/produtos] Erro ao buscar:", error);
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ success: false, message: "Acesso negado. Faça login primeiro." }, { status: 401 });
    }

    const formData = await req.formData();
    
    const nome = formData.get("nome") as string;
    const descricao = formData.get("descricao") as string;
    const precoRaw = formData.get("preco") as string;
    const preco = parseFloat(precoRaw);
    
    const categoryIDs = formData.getAll("categoryIDs") as string[];
    const validCategoryIDs = categoryIDs.filter(id => id.length === 24);

    const imageFile = formData.get("imagem") as File | null;

    console.log("[POST /api/produtos] Validando dados para:", nome);

    const validatedData = produtoSchema.parse({
      nome,
      descricao,
      preco,
      categoryIDs: validCategoryIDs,
    });

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      console.log("[POST /api/produtos] Enviando poção para a nuvem...");
      imageUrl = await uploadImageToS3(imageFile);
    }

    console.log("[POST /api/produtos] Gravando no MongoDB...");
    try {
      const novoProduto = await prisma.produto.create({
        data: {
          nome: validatedData.nome,
          descricao: validatedData.descricao,
          preco: validatedData.preco,
          imagem: imageUrl,
          categoryIDs: validatedData.categoryIDs || [],
          compraIDs: [],
        },
      });

      console.log("[POST /api/produtos] Produto criado com sucesso! ID:", novoProduto.id);

      return NextResponse.json({ 
        success: true, 
        message: "Produto criado com sucesso!",
        data: novoProduto 
      }, { status: 201 });

    } catch (prismaError: any) {
      console.error("[POST /api/produtos] Erro no Prisma:", prismaError.message);
      return NextResponse.json({ 
        success: false, 
        message: "Erro de banco de dados. Verifique os IDs de categoria.",
        error: prismaError.message 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("[POST /api/produtos] Erro crítico:", error);
    return handleError(error);
  }
}