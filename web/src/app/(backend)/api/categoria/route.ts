import { NextResponse } from "next/server";
import { CategoriaService } from "@/app/(backend)/services/CategoriaService";

export async function GET() {
  try {
    const categorias = await CategoriaService.listarTodas();
    return NextResponse.json(categorias);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar as categorias." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const novaCategoria = await CategoriaService.criar(body.nome); 
    
    return NextResponse.json(novaCategoria, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}