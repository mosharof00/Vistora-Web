import { z } from "zod";

const optionalEmail = z.union([
  z.literal(""),
  z.string().trim().email("Enter a valid email."),
]);

export const candidateSchema = z.object({
  candidateCode: z
    .string()
    .trim()
    .min(2, "Candidate code is required.")
    .max(40, "Keep the code under 40 characters."),
  fullName: z.string().trim().min(2, "Full name is required."),
  fatherName: z.string().trim().optional(),
  motherName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: optionalEmail,
  gender: z.enum(["male", "female", "other", ""]).optional(),
  dateOfBirth: z.string().optional(),
  nationality: z
    .string()
    .trim()
    .length(2, "Use a 2-letter country code.")
    .transform((v) => v.toUpperCase()),
  nidNumber: z.string().trim().optional(),
  maritalStatus: z
    .enum(["single", "married", "divorced", "widowed", ""])
    .optional(),
  religion: z.string().trim().optional(),
  presentAddress: z.string().trim().optional(),
  permanentAddress: z.string().trim().optional(),
  emergencyContactName: z.string().trim().optional(),
  emergencyContactPhone: z.string().trim().optional(),
  status: z.enum([
    "lead",
    "registered",
    "in_process",
    "deployed",
    "returned",
    "cancelled",
    "blacklisted",
  ]),
  source: z.enum(["direct", "agent", "walk_in", "referral"]),
  primaryAgentId: z.union([z.literal(""), z.string().uuid()]),
});

export type CandidateInput = z.infer<typeof candidateSchema>;

export const CANDIDATE_STATUS_OPTIONS = [
  { value: "lead", label: "Lead" },
  { value: "registered", label: "Registered" },
  { value: "in_process", label: "In process" },
  { value: "deployed", label: "Deployed" },
  { value: "returned", label: "Returned" },
  { value: "cancelled", label: "Cancelled" },
  { value: "blacklisted", label: "Blacklisted" },
] as const;

export const CANDIDATE_SOURCE_OPTIONS = [
  { value: "direct", label: "Direct" },
  { value: "agent", label: "Agent" },
  { value: "walk_in", label: "Walk-in" },
  { value: "referral", label: "Referral" },
] as const;
