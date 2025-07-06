import { z } from "zod";

export const productZodSchema = z.object({
  name: z.string({
    required_error: "Product name is required.",
    invalid_type_error: "Product name must be a string."
  }),
  description: z.string({
    invalid_type_error: "Product description must be a string."
  }).optional(),
  // ncm: z.string({
  //   required_error: "NCM is required.",
  //   invalid_type_error: "NCM must be a string."
  // }),
  // cest: z.string({
  //   invalid_type_error: "CEST must be a string."
  // }).optional(),
  sku: z.string({
    required_error: "SKU is required.",
    invalid_type_error: "SKU must be a string."
  }),
  price: z.number({
    required_error: "Price is required.",
    invalid_type_error: "Price must be a number."
  }).positive("Price must be a positive number."),
  unitOfMeasure: z.string({
    required_error: "Unit of measure is required.",
    invalid_type_error: "Unit of measure must be a string."
  }),
  // origin: z.number({
  //   required_error: "Origin is required.",
  //   invalid_type_error: "Origin must be a number."
  // }),
  // cfop: z.string({
  //   required_error: "CFOP is required.",
  //   invalid_type_error: "CFOP must be a string."
  // }),
  createdAt: z.date({
    invalid_type_error: "Creation date must be a valid date."
  }).optional(),
});
