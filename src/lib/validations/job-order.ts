import { z } from "zod";

export const jobOrderSchema = z.object({
  orderCode: z
    .string()
    .trim()
    .min(2, "Order code is required.")
    .max(40, "Keep the code under 40 characters."),
  title: z.string().trim().min(2, "Title is required."),
  employerCompanyId: z.string().uuid("Select an employer company."),
  jobCategoryId: z.string().uuid("Select a job category."),
  countryCode: z
    .string()
    .trim()
    .length(2, "Use a 2-letter country code.")
    .transform((v) => v.toUpperCase()),
  requiredCount: z.number().int().min(1, "Need at least 1 worker."),
  status: z.enum(["draft", "open", "fulfilled", "closed", "cancelled"]),
  ticketProvision: z.enum([
    "none",
    "go_only",
    "return_only",
    "go_and_return",
  ]),
  salaryAmount: z.number().min(0).nullable().optional(),
  salaryCurrencyCode: z.union([z.literal(""), z.string().length(3)]),
  salaryBdt: z.number().min(0).nullable().optional(),
  salaryOfferText: z.string().trim().optional(),
  contractDurationMonths: z.number().int().min(1).nullable().optional(),
  receivedAt: z.string().optional(),
  notes: z.string().trim().optional(),
});

export type JobOrderInput = z.infer<typeof jobOrderSchema>;

export const JOB_ORDER_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "open", label: "Open" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "closed", label: "Closed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const TICKET_PROVISION_OPTIONS = [
  { value: "none", label: "No ticket from employer" },
  { value: "go_only", label: "Go ticket by employer" },
  { value: "return_only", label: "Return ticket by employer" },
  { value: "go_and_return", label: "Go + return by employer" },
] as const;

export const JOB_ORDER_COUNTRY_OPTIONS = [
  { code: "SA", label: "Saudi Arabia" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "QA", label: "Qatar" },
  { code: "KW", label: "Kuwait" },
  { code: "OM", label: "Oman" },
  { code: "BH", label: "Bahrain" },
  { code: "MY", label: "Malaysia" },
  { code: "SG", label: "Singapore" },
] as const;
