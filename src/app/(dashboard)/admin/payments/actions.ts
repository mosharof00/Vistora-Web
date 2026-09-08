"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import {
  candidatePaymentSchema,
  type CandidatePaymentFormValues,
} from "@/lib/validations/candidate-payment";

type ActionResult = { error: string };

function emptyToNull(value?: string | null) {
  const v = value?.trim();
  return v ? v : null;
}

function toRow(values: CandidatePaymentFormValues) {
  const currency = values.currencyCode.trim().toUpperCase();
  const receivedAt = values.receivedAt.includes("T")
    ? values.receivedAt
    : `${values.receivedAt}T12:00:00.000Z`;

  const amountBdt =
    values.amountBdt === undefined || values.amountBdt === null
      ? currency === "BDT"
        ? values.amount
        : values.amount
      : values.amountBdt;

  return {
    candidate_id: values.candidateId,
    candidate_case_id: emptyToNull(values.candidateCaseId),
    fee_schedule_id: emptyToNull(values.feeScheduleId),
    direction: values.direction,
    amount: values.amount,
    currency_code: currency,
    currency,
    amount_bdt: amountBdt,
    payment_gateway_id: emptyToNull(values.paymentGatewayId),
    method: values.method,
    reference_no: emptyToNull(values.referenceNo),
    received_at: receivedAt,
    notes: emptyToNull(values.notes),
  };
}

function revalidatePaymentPaths(candidateId?: string, id?: string) {
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
  if (candidateId) revalidatePath(`/admin/candidates/${candidateId}`);
  if (id) {
    revalidatePath(`/admin/payments/${id}`);
    revalidatePath(`/admin/payments/${id}/edit`);
  }
}

export async function createCandidatePayment(
  values: CandidatePaymentFormValues
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = candidatePaymentSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .insert(toRow(parsed.data))
    .select("id, candidate_id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePaymentPaths(data.candidate_id ?? undefined, data.id);
  redirect("/admin/payments?created=1");
}

export async function updateCandidatePayment(
  id: string,
  values: CandidatePaymentFormValues
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = candidatePaymentSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("payments")
    .update(toRow(parsed.data))
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePaymentPaths(parsed.data.candidateId, id);
  redirect("/admin/payments?updated=1");
}
