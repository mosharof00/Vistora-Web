"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import {
  jobCategorySchema,
  slugifyJobCategory,
  type JobCategoryFormValues,
} from "@/lib/validations/job-category";

type ActionResult = { error: string };

function emptyToNull(value?: string) {
  const v = value?.trim();
  return v ? v : null;
}

function toRow(values: JobCategoryFormValues) {
  const slug =
    slugifyJobCategory(values.slug || "") ||
    slugifyJobCategory(values.name);
  return {
    name: values.name.trim(),
    slug,
    description: emptyToNull(values.description),
    is_active: values.isActive,
  };
}

function revalidateCategoryPaths(id?: string) {
  revalidatePath("/admin/job-categories");
  revalidatePath("/admin/job-orders");
  revalidatePath("/admin/job-orders/new");
  revalidatePath("/admin");
  if (id) revalidatePath(`/admin/job-categories/${id}`);
}

export async function createJobCategory(
  values: JobCategoryFormValues
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = jobCategorySchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }
  const row = toRow(parsed.data);
  if (row.slug.length < 2) {
    return { error: "Could not build a valid slug from the name." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("job_categories").insert(row);

  if (error) {
    if (error.code === "23505") {
      return { error: "That name or slug is already in use." };
    }
    return { error: error.message };
  }

  revalidateCategoryPaths();
  redirect("/admin/job-categories?created=1");
}

export async function updateJobCategory(
  id: string,
  values: JobCategoryFormValues
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = jobCategorySchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }
  const row = toRow(parsed.data);
  if (row.slug.length < 2) {
    return { error: "Could not build a valid slug from the name." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("job_categories")
    .update(row)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That name or slug is already in use." };
    }
    return { error: error.message };
  }

  revalidateCategoryPaths(id);
  redirect("/admin/job-categories?updated=1");
}

export async function setJobCategoryActive(
  id: string,
  isActive: boolean
): Promise<ActionResult | void> {
  await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase
    .from("job_categories")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateCategoryPaths(id);
}
