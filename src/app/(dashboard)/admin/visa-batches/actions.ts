"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import {
  visaBatchSchema,
  type VisaBatchInput,
} from "@/lib/validations/visa-batch";

type ActionResult = { error: string };

function emptyToNull(value?: string | null) {
  const v = value?.trim();
  return v ? v : null;
}

function toRow(values: VisaBatchInput) {
  return {
    batch_code: values.batchCode.trim().toUpperCase(),
    title: values.title.trim(),
    job_order_id: values.jobOrderId,
    visa_number: emptyToNull(values.visaNumber),
    visa_id_number: emptyToNull(values.visaIdNumber),
    quota_count:
      values.quotaCount === undefined || values.quotaCount === null
        ? null
        : values.quotaCount,
    pro_office: emptyToNull(values.proOffice),
    status: values.status,
    opened_at: emptyToNull(values.openedAt),
    closed_at: emptyToNull(values.closedAt),
    notes: emptyToNull(values.notes),
  };
}

function revalidateVisaBatchPaths(id?: string, jobOrderId?: string) {
  revalidatePath("/admin/visa-batches");
  revalidatePath("/admin");
  if (id) {
    revalidatePath(`/admin/visa-batches/${id}`);
    revalidatePath(`/admin/visa-batches/${id}/edit`);
  }
  if (jobOrderId) {
    revalidatePath(`/admin/job-orders/${jobOrderId}`);
  }
}

export async function createVisaBatch(
  values: VisaBatchInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = visaBatchSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_batches")
    .insert(toRow(parsed.data))
    .select("id, job_order_id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        error: "That batch code or visa number is already in use.",
      };
    }
    return { error: error.message };
  }

  revalidateVisaBatchPaths(data.id, data.job_order_id);
  redirect(`/admin/visa-batches/${data.id}?created=1`);
}

export async function updateVisaBatch(
  id: string,
  values: VisaBatchInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = visaBatchSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("visa_batches")
    .update(toRow(parsed.data))
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        error: "That batch code or visa number is already in use.",
      };
    }
    return { error: error.message };
  }

  revalidateVisaBatchPaths(id, parsed.data.jobOrderId);
  redirect(`/admin/visa-batches/${id}?updated=1`);
}
