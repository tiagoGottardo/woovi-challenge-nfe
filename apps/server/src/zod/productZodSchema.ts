import mongoose from "mongoose";
import { z } from "zod";

export const ProductZodSchema = z.object({
  companyId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId for companyId",
  }),
  name: z.string({
    required_error: "Product name is required.",
    invalid_type_error: "Product name must be a string.",
  }).min(3, "Product name must be at least 3 characters long."),
  description: z.string({
    required_error: "Product description is required.",
    invalid_type_error: "Product description must be a string.",
  }).min(10, "Product description must be at least 10 characters long."),
  ncm: z.string({
    required_error: "NCM is required.",
    invalid_type_error: "NCM must be a string.",
  }).length(8, "NCM must be 8 characters long."),
  price: z.number({
    required_error: "Price is required.",
    invalid_type_error: "Price must be a number.",
  }).positive("Price must be a positive number."),
  unitOfMeasure: z.enum(["KG", "UN", "MT"], {
    required_error: "Unit of measure is required.",
    invalid_type_error: "Unit of measure must be 'KG', 'UN', or 'MT'.",
  })
});
