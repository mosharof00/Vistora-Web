import { z } from "zod";

export const adminProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  phone: z.string().trim().optional().or(z.literal("")),
});

export type AdminProfileInput = z.infer<typeof adminProfileSchema>;
