import { z } from "zod";

export const employerCompanySchema = z.object({
  companyCode: z
    .string()
    .trim()
    .min(2, "Company code is required.")
    .max(40, "Keep the code under 40 characters."),
  legalName: z.string().trim().min(2, "Legal name is required."),
  tradeName: z.string().trim().optional(),
  countryCode: z
    .string()
    .trim()
    .length(2, "Use a 2-letter country code (e.g. SA).")
    .transform((v) => v.toUpperCase()),
  city: z.string().trim().optional(),
  address: z.string().trim().optional(),
  contactPerson: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),
  contactEmail: z.union([
    z.literal(""),
    z.string().trim().email("Enter a valid email."),
  ]),
  licenseOrCrNumber: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]),
  notes: z.string().trim().optional(),
});

export type EmployerCompanyInput = z.infer<typeof employerCompanySchema>;

export const COUNTRY_OPTIONS = [
  { code: "SA", label: "Saudi Arabia" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "QA", label: "Qatar" },
  { code: "KW", label: "Kuwait" },
  { code: "OM", label: "Oman" },
  { code: "BH", label: "Bahrain" },
  { code: "MY", label: "Malaysia" },
  { code: "SG", label: "Singapore" },
  { code: "BD", label: "Bangladesh" },
] as const;
