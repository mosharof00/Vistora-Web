import { z } from "zod";

export function slugifyJobCategory(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export const jobCategorySchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(80),
  slug: z.string().trim().max(60).optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type JobCategoryFormValues = z.infer<typeof jobCategorySchema>;
