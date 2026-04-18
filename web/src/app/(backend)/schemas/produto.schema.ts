import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const produtoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  preco: z.coerce.number().positive("Preço deve ser positivo"),
  categoryIDs: z.array(
    z.string().regex(objectIdRegex, "ID de categoria inválido")
  ).default([]),
});

export const patchProdutoSchema = produtoSchema.partial();
export type ProdutoData = z.infer<typeof produtoSchema>;