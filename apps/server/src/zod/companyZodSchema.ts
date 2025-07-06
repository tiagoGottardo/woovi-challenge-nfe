import * as z from 'zod';

export const companyZodSchema = z.object({
  name: z.string({
    required_error: "Company name is required.",
    invalid_type_error: "Company name must be a string."
  }).min(1, "Company name cannot be empty."),

  cnpj: z.string({
    required_error: "CNPJ is required.",
    invalid_type_error: "CNPJ must be a string."
  }).length(14, "CNPJ must be exactly 14 characters long."),

  address: z.string({
    required_error: "Address is required.",
    invalid_type_error: "Address must be a string."
  }).min(1, "Address cannot be empty."),

  city: z.string({
    required_error: "City is required.",
    invalid_type_error: "City must be a string."
  }).min(1, "City cannot be empty."),

  state: z.string({
    required_error: "State is required.",
    invalid_type_error: "State must be a string."
  }).length(2, "State must be a 2-character abbreviation (e.g., 'PR')."),

  zipCode: z.string({
    required_error: "Zip code is required.",
    invalid_type_error: "Zip code must be a string."
  }).length(8, "Zip code must be exactly 8 characters long.")
});
