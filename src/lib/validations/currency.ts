import { z } from "zod";

export const currencySchema = z.object({
  code: z
    .string()
    .trim()
    .length(3, "Use a 3-letter ISO code.")
    .regex(/^[A-Za-z]{3}$/, "Use letters only (e.g. BDT, USD)."),
  name: z.string().trim().min(2, "Name is required.").max(80),
  symbol: z.string().trim().min(1, "Symbol is required.").max(12),
  decimalPlaces: z.number().int().min(0).max(4),
  isActive: z.boolean(),
});

export type CurrencyFormValues = z.infer<typeof currencySchema>;
