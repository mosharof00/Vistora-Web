import { z } from "zod";

export const candidateCaseSchema = z.object({
  caseCode: z
    .string()
    .trim()
    .min(2, "Case code is required.")
    .max(40, "Keep the code under 40 characters."),
  candidateId: z.string().uuid("Select a candidate."),
  visaBatchId: z.string().uuid("Select a visa batch."),
  jobOrderId: z.string().uuid("Select a job order."),
  agentId: z.union([z.literal(""), z.string().uuid()]),
  assignedStaffId: z.union([z.literal(""), z.string().uuid()]),
  overallStatus: z.enum([
    "registered",
    "processing",
    "cleared",
    "ticketed",
    "deployed",
    "cancelled",
  ]),
  mofaNumber: z.string().trim().optional(),
  processingOffice: z.string().trim().optional(),
  tradeRemark: z.string().trim().optional(),
  flightDate: z.string().optional(),
  flightNumber: z.string().trim().optional(),
  remarks: z.string().trim().optional(),
});

export type CandidateCaseInput = z.infer<typeof candidateCaseSchema>;

export const CASE_STATUS_OPTIONS = [
  { value: "registered", label: "Registered" },
  { value: "processing", label: "Processing" },
  { value: "cleared", label: "Cleared" },
  { value: "ticketed", label: "Ticketed" },
  { value: "deployed", label: "Deployed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const PROCESS_STEP_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "failed", label: "Failed" },
  { value: "waived", label: "Waived" },
  { value: "not_required", label: "Not required" },
] as const;

export const processStepUpdateSchema = z.object({
  status: z.enum([
    "pending",
    "in_progress",
    "done",
    "failed",
    "waived",
    "not_required",
  ]),
  referenceNo: z.string().trim().optional(),
  eventDate: z.string().optional(),
  notes: z.string().trim().optional(),
});

export type ProcessStepUpdateInput = z.infer<typeof processStepUpdateSchema>;
