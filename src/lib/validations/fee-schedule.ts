import { z } from "zod";

import { COUNTRY_OPTIONS } from "@/lib/validations/employer-company";

export { COUNTRY_OPTIONS };

export const feeScheduleSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(120),
  feeCode: z
    .string()
    .trim()
    .min(2, "Fee code is required.")
    .max(40, "Keep the code under 40 characters.")
    .regex(
      /^[A-Z0-9-]+$/,
      "Use uppercase letters, numbers, and hyphens only."
    ),
  amountBdt: z.number().min(0, "Amount must be 0 or greater."),
  currency: z
    .string()
    .trim()
    .length(3, "Use a 3-letter currency code."),
  countryCode: z.enum([
    "",
    "SA",
    "AE",
    "QA",
    "KW",
    "OM",
    "BH",
    "MY",
    "SG",
    "BD",
  ]),
  jobCategoryId: z.union([z.literal(""), z.string().uuid()]),
  notes: z.string().trim().optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type FeeScheduleFormValues = z.infer<typeof feeScheduleSchema>;
