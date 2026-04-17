import { z } from "zod";

export const statusEnum = z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]);

export const checkoutSchema = z.object({
  produtoIDs: z.array(z.string()).min(1, "A compra deve ter pelo menos um produto"),
});

export const updateStatusSchema = z.object({
  status: statusEnum,
});

export type CheckoutData = z.infer<typeof checkoutSchema>;
export type UpdateStatusData = z.infer<typeof updateStatusSchema>;