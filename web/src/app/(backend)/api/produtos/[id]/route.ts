import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { deleteImageFromS3, uploadImageToS3 } from "@/utils/s3";
import { handleError } from "@/utils/handleError";

type RouteParams = { params: { id: string } };

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

    const { id } = params;

    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });

    if (produto.imagem && produto.imagem.startsWith("http")) {
      await deleteImageFromS3(produto.imagem);
    }

    await prisma.produto.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Produto e imagem removidos com sucesso" });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ message: "Não autorizado" }, { status: 401 });

    const { id } = params;
    const formData = await req.formData();

    const produtoAntigo = await prisma.produto.findUnique({ where: { id } });
    if (!produtoAntigo) return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });

    const nome = formData.get("nome") as string || undefined;
    const descricao = formData.get("descricao") as string || undefined;
    const precoRaw = formData.get("preco") as string;
    const preco = precoRaw ? parseFloat(precoRaw) : undefined;
    const imageFile = formData.get("imagem") as File | null;

    let novaImageUrl = produtoAntigo.imagem;

    if (imageFile && imageFile.size > 0) {
      novaImageUrl = await uploadImageToS3(imageFile);

      if (produtoAntigo.imagem && produtoAntigo.imagem.startsWith("http")) {
        await deleteImageFromS3(produtoAntigo.imagem);
      }
    }

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: {
        nome,
        descricao,
        preco,
        imagem: novaImageUrl,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Produto atualizado com sucesso", 
      data: produtoAtualizado 
    });
  } catch (error) {
    return handleError(error);
  }
}