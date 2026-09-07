import { z } from "zod";

export const agentSchema = z.object({
  agentCode: z
    .string()
    .trim()
    .min(2, "Agent code is required.")
    .max(40, "Keep the code under 40 characters."),
  fullName: z.string().trim().min(2, "Full name is required."),
  agencyName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.union([
    z.literal(""),
    z.string().trim().email("Enter a valid email."),
  ]),
  district: z.string().trim().optional(),
  address: z.string().trim().optional(),
  nidOrTradeLicense: z.string().trim().optional(),
  bankName: z.string().trim().optional(),
  bankAccount: z.string().trim().optional(),
  commissionType: z.enum(["fixed", "percent", "per_candidate"]),
  commissionValue: z.number().min(0, "Must be 0 or greater."),
  status: z.enum(["active", "inactive"]),
  notes: z.string().trim().optional(),
});

export type AgentInput = z.infer<typeof agentSchema>;

export const COMMISSION_TYPE_OPTIONS = [
  { value: "fixed", label: "Fixed (BDT)" },
  { value: "percent", label: "Percent (%)" },
  { value: "per_candidate", label: "Per candidate (BDT)" },
] as const;
