import { z } from "zod";

export const GATEWAY_KIND_OPTIONS = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank" },
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "card", label: "Card" },
  { value: "other", label: "Other" },
] as const;

export const paymentGatewaySchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Code is required.")
    .max(40, "Keep the code under 40 characters.")
    .regex(
      /^[a-z0-9_]+$/,
      "Use lowercase letters, numbers, and underscores only."
    ),
  name: z.string().trim().min(2, "Name is required.").max(80),
  kind: z.enum(["cash", "bank", "bkash", "nagad", "card", "other"]),
  accountName: z.string().trim().optional().or(z.literal("")),
  accountNumber: z.string().trim().optional().or(z.literal("")),
  bankName: z.string().trim().optional().or(z.literal("")),
  branchName: z.string().trim().optional().or(z.literal("")),
  instructions: z.string().trim().optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).max(9999),
  isActive: z.boolean(),
});

export type PaymentGatewayFormValues = z.infer<typeof paymentGatewaySchema>;
