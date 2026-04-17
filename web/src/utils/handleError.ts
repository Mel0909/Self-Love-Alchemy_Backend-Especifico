import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleError(error: unknown) {
  console.error("[API_ERROR]:", error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      { 
        success: false, 
        message: `Dados inválidos: ${error.issues[0].message}` 
      },
      { status: 400 }
    );
  }

  if (typeof error === 'object' && error !== null && 'code' in error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: "Registro não encontrado no sistema" },
        { status: 404 }
      );
    }
  }

  const message = error instanceof Error ? error.message : "Erro interno inesperado";
  
  if (message.includes("autenticado")) {
    return NextResponse.json({ success: false, message }, { status: 401 });
  }

  return NextResponse.json(
    { success: false, message },
    { status: 500 }
  );
}