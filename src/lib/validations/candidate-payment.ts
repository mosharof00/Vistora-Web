import { z } from "zod";

import { PAYMENT_METHOD_OPTIONS } from "@/lib/validations/company-payment";

export { PAYMENT_METHOD_OPTIONS };

export const PAYMENT_DIRECTION_OPTIONS = [
  { value: "in", label: "In (received)" },
  { value: "out", label: "Out (refund / payout)" },
] as const;

export const candidatePaymentSchema = z.object({
  candidateId: z.string().uuid("Select a candidate."),
  candidateCaseId: z.union([z.literal(""), z.string().uuid()]),
  feeScheduleId: z.union([z.literal(""), z.string().uuid()]),
  direction: z.enum(["in", "out"]),
  amount: z.number().min(0.01, "Enter an amount."),
  currencyCode: z.string().trim().length(3, "Use a 3-letter currency code."),
  amountBdt: z.number().min(0).nullable().optional(),
  paymentGatewayId: z.union([z.literal(""), z.string().uuid()]),
  method: z.enum(["cash", "bkash", "nagad", "bank", "other"]),
  referenceNo: z.string().trim().optional().or(z.literal("")),
  receivedAt: z.string().min(1, "Received date is required."),
  notes: z.string().trim().optional().or(z.literal("")),
});

export type CandidatePaymentFormValues = z.infer<typeof candidatePaymentSchema>;
