"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import {
  feeScheduleSchema,
  type FeeScheduleFormValues,
} from "@/lib/validations/fee-schedule";

type ActionResult = { error: string };

function emptyToNull(value?: string) {
  const v = value?.trim();
  return v ? v : null;
}

function toRow(values: FeeScheduleFormValues) {
  return {
    name: values.name.trim(),
    fee_code: values.feeCode.trim().toUpperCase(),
    amount_bdt: values.amountBdt,
    currency: (values.currency || "BDT").trim().toUpperCase(),
    country_code: emptyToNull(values.countryCode),
    job_category_id: emptyToNull(values.jobCategoryId),
    notes: emptyToNull(values.notes),
    is_active: values.isActive,
  };
}

function revalidateFeePaths(id?: string) {
  revalidatePath("/admin/fee-schedules");
  revalidatePath("/admin");
  if (id) revalidatePath(`/admin/fee-schedules/${id}`);
}

export async function createFeeSchedule(
  values: FeeScheduleFormValues
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = feeScheduleSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("fee_schedules")
    .insert(toRow(parsed.data));

  if (error) {
    if (error.code === "23505") {
      return { error: "That fee code is already in use." };
    }
    return { error: error.message };
  }

  revalidateFeePaths();
  redirect("/admin/fee-schedules?created=1");
}

export async function updateFeeSchedule(
  id: string,
  values: FeeScheduleFormValues
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = feeScheduleSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("fee_schedules")
    .update(toRow(parsed.data))
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That fee code is already in use." };
    }
    return { error: error.message };
  }

  revalidateFeePaths(id);
  redirect("/admin/fee-schedules?updated=1");
}

export async function setFeeScheduleActive(
  id: string,
  isActive: boolean
): Promise<ActionResult | void> {
  await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase
    .from("fee_schedules")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateFeePaths(id);
}
