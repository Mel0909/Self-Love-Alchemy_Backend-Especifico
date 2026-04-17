import { NextResponse } from "next/server";
import { ProdutoService } from "@/app/(backend)/services/ProdutoService";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await ProdutoService.deletar(id);
    return NextResponse.json({ message: "Poção removida com sucesso!" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar" }, { status: 400 });
  }
}