"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import {
  jobOrderSchema,
  type JobOrderInput,
} from "@/lib/validations/job-order";

type ActionResult = { error: string };

function emptyToNull(value?: string | null) {
  const v = value?.trim();
  return v ? v : null;
}

function toRow(values: JobOrderInput) {
  return {
    order_code: values.orderCode.trim().toUpperCase(),
    title: values.title.trim(),
    employer_company_id: values.employerCompanyId,
    job_category_id: values.jobCategoryId,
    country_code: values.countryCode,
    required_count: values.requiredCount,
    status: values.status,
    ticket_provision: values.ticketProvision,
    salary_amount:
      values.salaryAmount === undefined || values.salaryAmount === null
        ? null
        : values.salaryAmount,
    salary_currency_code: emptyToNull(values.salaryCurrencyCode),
    salary_bdt:
      values.salaryBdt === undefined || values.salaryBdt === null
        ? null
        : values.salaryBdt,
    salary_offer_text: emptyToNull(values.salaryOfferText),
    contract_duration_months:
      values.contractDurationMonths === undefined ||
      values.contractDurationMonths === null
        ? null
        : values.contractDurationMonths,
    received_at: emptyToNull(values.receivedAt),
    notes: emptyToNull(values.notes),
  };
}

function revalidateJobOrderPaths(id?: string, companyId?: string) {
  revalidatePath("/admin/job-orders");
  revalidatePath("/admin");
  if (id) {
    revalidatePath(`/admin/job-orders/${id}`);
    revalidatePath(`/admin/job-orders/${id}/edit`);
  }
  if (companyId) {
    revalidatePath(`/admin/companies/${companyId}`);
  }
}

export async function createJobOrder(
  values: JobOrderInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = jobOrderSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_orders")
    .insert(toRow(parsed.data))
    .select("id, employer_company_id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "That order code is already in use." };
    }
    return { error: error.message };
  }

  revalidateJobOrderPaths(data.id, data.employer_company_id);
  redirect(`/admin/job-orders/${data.id}?created=1`);
}

export async function updateJobOrder(
  id: string,
  values: JobOrderInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = jobOrderSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("job_orders")
    .update(toRow(parsed.data))
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That order code is already in use." };
    }
    return { error: error.message };
  }

  revalidateJobOrderPaths(id, parsed.data.employerCompanyId);
  redirect(`/admin/job-orders/${id}?updated=1`);
}
