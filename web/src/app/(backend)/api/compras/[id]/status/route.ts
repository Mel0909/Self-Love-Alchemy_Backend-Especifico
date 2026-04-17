import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateStatusSchema } from "@/app/(backend)/schemas/compra.schema";
import { handleError } from "@/utils/handleError";
import { auth } from "@/auth";

export async function PATCH(
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

    const body = await req.json();
    
    const { status } = updateStatusSchema.parse(body);

    const compraAtualizada = await prisma.compra.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: "Status da compra atualizado com sucesso",
      data: compraAtualizada
    });

  } catch (error) {
    return handleError(error);
  }
}