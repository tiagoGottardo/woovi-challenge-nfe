import mongoose from "mongoose"
import { z } from "zod"

const saleItemZodSchema = z.object({
  productId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId for productId",
  }),
  quantity: z.number().min(0, "Quantity must be a non-negative number"),
});

export const SaleZodSchema = z.object({
  companyId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId for companyId",
  }),
  freightCost: z.number({
    required_error: "Freight cost is required.",
    invalid_type_error: "Freight cost must be a number.",
  }).positive("Freight cost must be a positive number."),
  pixKey: z.string({ message: "Pix key must be provided" }),
  buyerUF: z.string({
    required_error: "UF is required.",
    invalid_type_error: "UF must be a string.",
  }).length(2, "UF must be 2 characters long."),
  items: z.array(saleItemZodSchema).min(1, "Sale must have at least one item"),
});
