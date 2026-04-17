import { z } from "zod";

export const produtoSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  preco: z.number().positive("Preço deve ser positivo"),
  categoryIDs: z.array(z.string()).optional(),
});

export const patchProdutoSchema = produtoSchema.partial();

export type ProdutoData = z.infer<typeof produtoSchema>;