import { z } from "zod";

export const companyPaymentSchema = z.object({
  employerCompanyId: z.string().uuid("Select an employer company."),
  jobOrderId: z.union([z.literal(""), z.string().uuid()]),
  kind: z.enum(["investment_out", "reimbursement_in", "fee_in", "other"]),
  amount: z.number().min(0.01, "Enter an amount."),
  currencyCode: z
    .string()
    .trim()
    .length(3, "Use a 3-letter currency code.")
    .transform((v) => v.toUpperCase()),
  amountBdt: z.number().min(0).nullable().optional(),
  paymentGatewayId: z.union([z.literal(""), z.string().uuid()]),
  method: z.enum(["cash", "bkash", "nagad", "bank", "other"]),
  referenceNo: z.string().trim().optional(),
  paidAt: z.string().min(1, "Paid date is required."),
  notes: z.string().trim().optional(),
});

export type CompanyPaymentInput = z.infer<typeof companyPaymentSchema>;

export const COMPANY_PAYMENT_KIND_OPTIONS = [
  { value: "investment_out", label: "Investment out (to employer)" },
  { value: "reimbursement_in", label: "Reimbursement in" },
  { value: "fee_in", label: "Fee in" },
  { value: "other", label: "Other" },
] as const;

export const PAYMENT_METHOD_OPTIONS = [
  { value: "bank", label: "Bank" },
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "cash", label: "Cash" },
  { value: "other", label: "Other" },
] as const;
