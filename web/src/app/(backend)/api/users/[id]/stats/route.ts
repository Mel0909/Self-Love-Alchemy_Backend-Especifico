import { NextResponse } from "next/server";
import { UserService } from "../../../../services/user.service";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 });
    }

    const stats = await UserService.getUserStats(id);

    return NextResponse.json(stats, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao gerar estatísticas místicas:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}