import mongoose from "mongoose"
import { z } from "zod"

const saleItemZodSchema = z.object({
  productId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId for productId",
  }),
  quantity: z.number().min(0, "Quantity must be a non-negative number"),
  // unitPrice: z.number().min(0, "Unit price must be a non-negative number"),
  // totalPrice: z.number().min(0, "Total price must be a non-negative number"),
});

export const saleZodSchema = z.object({
  companyId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId for companyId",
  }),
  pixKey: z.string({ message: "Pix key must be provided" }),
  // buyer: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  //   message: "Invalid ObjectId for buyer",
  // }).optional(),
  items: z.array(saleItemZodSchema).min(1, "Sale must have at least one item"),
});
