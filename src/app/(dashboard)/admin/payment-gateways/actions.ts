"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import {
  paymentGatewaySchema,
  type PaymentGatewayFormValues,
} from "@/lib/validations/payment-gateway";

type ActionResult = { error: string };

function emptyToNull(value?: string) {
  const v = value?.trim();
  return v ? v : null;
}

function toRow(values: PaymentGatewayFormValues) {
  return {
    code: values.code.trim().toLowerCase(),
    name: values.name.trim(),
    kind: values.kind,
    account_name: emptyToNull(values.accountName),
    account_number: emptyToNull(values.accountNumber),
    bank_name: emptyToNull(values.bankName),
    branch_name: emptyToNull(values.branchName),
    instructions: emptyToNull(values.instructions),
    sort_order: values.sortOrder,
    is_active: values.isActive,
  };
}

function revalidateGatewayPaths(id?: string) {
  revalidatePath("/admin/payment-gateways");
  revalidatePath("/admin/company-payments");
  revalidatePath("/admin/company-payments/new");
  revalidatePath("/admin");
  if (id) revalidatePath(`/admin/payment-gateways/${id}`);
}

export async function createPaymentGateway(
  values: PaymentGatewayFormValues
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = paymentGatewaySchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("payment_gateways")
    .insert(toRow(parsed.data));

  if (error) {
    if (error.code === "23505") {
      return { error: "That gateway code is already in use." };
    }
    return { error: error.message };
  }

  revalidateGatewayPaths();
  redirect("/admin/payment-gateways?created=1");
}

export async function updatePaymentGateway(
  id: string,
  values: PaymentGatewayFormValues
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = paymentGatewaySchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("payment_gateways")
    .update(toRow(parsed.data))
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That gateway code is already in use." };
    }
    return { error: error.message };
  }

  revalidateGatewayPaths(id);
  redirect("/admin/payment-gateways?updated=1");
}

export async function setPaymentGatewayActive(
  id: string,
  isActive: boolean
): Promise<ActionResult | void> {
  await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase
    .from("payment_gateways")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateGatewayPaths(id);
}
