import { z } from "zod";
import { nameSchema, slugSchema } from "./base.schema";

export const createCategorySchema = z.object({
  nome: nameSchema,
  slug: slugSchema,
});

export const patchCategorySchema = createCategorySchema
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "Pelo menos um campo precisa ser fornecido para atualização",
  });

export type CreateCategoryData = z.infer<typeof createCategorySchema>;
export type PatchCategoryData = z.infer<typeof patchCategorySchema>;