import { z } from "zod";

export const AddressZodSchema = z.object({
  street: z.string({
    required_error: "Street is required.",
    invalid_type_error: "Street must be a string.",
  }).min(1, "Street cannot be empty."),
  addressNumber: z.string({
    required_error: "Address number is required.",
    invalid_type_error: "Address number must be a string.",
  }).min(1, "Address number cannot be empty."),
  neighborhood: z.string({
    required_error: "Neighborhood is required.",
    invalid_type_error: "Neighborhood must be a string.",
  }).min(1, "Neighborhood cannot be empty."),
  cityCode: z.string({
    required_error: "City code is required.",
    invalid_type_error: "City code must be a string.",
  }).min(1, "City code cannot be empty."),
  city: z.string({
    required_error: "City is required.",
    invalid_type_error: "City must be a string.",
  }).min(1, "City cannot be empty."),
  uf: z.string({
    required_error: "UF is required.",
    invalid_type_error: "UF must be a string.",
  }).length(2, "UF must be 2 characters long."),
  zipCode: z.string({
    required_error: "Zip code is required.",
    invalid_type_error: "Zip code must be a string.",
  }).regex(/^\d{8}$/, "Invalid zip code format. It should contain 8 digits only."),
});

export const CompanyZodSchema = z.object({
  name: z.string({
    required_error: "Company name is required.",
    invalid_type_error: "Company name must be a string.",
  }).min(1, "Company name cannot be empty."),
  cnpj: z.string({
    required_error: "CNPJ is required.",
    invalid_type_error: "CNPJ must be a string.",
  }).regex(/^\d{14}$/, "Invalid CNPJ format. Use XXXXXXXXXXXXXX."),
  address: AddressZodSchema,
  danfe_emails: z.array(z.string().email("Invalid email format for DANFE email."), {
    required_error: "DANFE emails are required.",
    invalid_type_error: "DANFE emails must be an array of strings.",
  }).optional(),
  phone: z.string({
    required_error: "Phone number is required.",
    invalid_type_error: "Phone number must be a string.",
  }).regex(/^\d{10,11}$/, "Invalid phone number format. It should contain 10 or 11 digits only."),
  stateSubscription: z.string({
    required_error: "State subscription is required.",
    invalid_type_error: "State subscription must be a string.",
  }).min(1, "State subscription cannot be empty."),
  taxRegime: z.literal("Simples Nacional", {
    required_error: "Tax regime is required.",
    invalid_type_error: "Tax regime must be 'Simples Nacional'.",
  }),
  csc: z.string({
    required_error: "CSC is required.",
    invalid_type_error: "CSC must be a string.",
  }).min(1, "CSC cannot be empty.")
});
