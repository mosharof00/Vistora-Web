"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import {
  companyPaymentSchema,
  type CompanyPaymentInput,
} from "@/lib/validations/company-payment";

type ActionResult = { error: string };

function emptyToNull(value?: string | null) {
  const v = value?.trim();
  return v ? v : null;
}

function toRow(values: CompanyPaymentInput) {
  const paidAt = values.paidAt.includes("T")
    ? values.paidAt
    : `${values.paidAt}T12:00:00.000Z`;

  return {
    employer_company_id: values.employerCompanyId,
    job_order_id: emptyToNull(values.jobOrderId),
    kind: values.kind,
    amount: values.amount,
    currency_code: values.currencyCode,
    amount_bdt:
      values.amountBdt === undefined || values.amountBdt === null
        ? values.currencyCode === "BDT"
          ? values.amount
          : null
        : values.amountBdt,
    payment_gateway_id: emptyToNull(values.paymentGatewayId),
    method: values.method,
    reference_no: emptyToNull(values.referenceNo),
    paid_at: paidAt,
    notes: emptyToNull(values.notes),
  };
}

function revalidatePaymentPaths(companyId?: string, id?: string) {
  revalidatePath("/admin/company-payments");
  revalidatePath("/admin");
  if (companyId) revalidatePath(`/admin/companies/${companyId}`);
  if (id) {
    revalidatePath(`/admin/company-payments/${id}`);
    revalidatePath(`/admin/company-payments/${id}/edit`);
  }
}

export async function createCompanyPayment(
  values: CompanyPaymentInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = companyPaymentSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("company_payments")
    .insert(toRow(parsed.data))
    .select("id, employer_company_id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePaymentPaths(data.employer_company_id, data.id);
  redirect(`/admin/company-payments?created=1`);
}

export async function updateCompanyPayment(
  id: string,
  values: CompanyPaymentInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = companyPaymentSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("company_payments")
    .update(toRow(parsed.data))
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePaymentPaths(parsed.data.employerCompanyId, id);
  redirect(`/admin/company-payments?updated=1`);
}
