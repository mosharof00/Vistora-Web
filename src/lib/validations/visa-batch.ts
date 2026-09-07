import { z } from "zod";

export const visaBatchSchema = z.object({
  batchCode: z
    .string()
    .trim()
    .min(2, "Batch code is required.")
    .max(40, "Keep the code under 40 characters."),
  title: z.string().trim().min(2, "Title is required."),
  jobOrderId: z.string().uuid("Select a job order."),
  visaNumber: z.string().trim().optional(),
  visaIdNumber: z.string().trim().optional(),
  quotaCount: z.number().int().min(1).nullable().optional(),
  proOffice: z.string().trim().optional(),
  status: z.enum(["open", "processing", "completed", "cancelled"]),
  openedAt: z.string().optional(),
  closedAt: z.string().optional(),
  notes: z.string().trim().optional(),
});

export type VisaBatchInput = z.infer<typeof visaBatchSchema>;

export const VISA_BATCH_STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;
