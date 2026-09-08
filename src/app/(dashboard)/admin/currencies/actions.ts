"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import {
  currencySchema,
  type CurrencyFormValues,
} from "@/lib/validations/currency";

type ActionResult = { error: string };

function toRow(values: CurrencyFormValues) {
  return {
    code: values.code.trim().toUpperCase(),
    name: values.name.trim(),
    symbol: values.symbol.trim(),
    decimal_places: values.decimalPlaces,
    is_active: values.isActive,
  };
}

function revalidateCurrencyPaths(code?: string) {
  revalidatePath("/admin/currencies");
  revalidatePath("/admin/payments");
  revalidatePath("/admin/payments/new");
  revalidatePath("/admin/company-payments");
  revalidatePath("/admin/company-payments/new");
  revalidatePath("/admin/job-orders");
  revalidatePath("/admin");
  if (code) revalidatePath(`/admin/currencies/${code}`);
}

export async function createCurrency(
  values: CurrencyFormValues
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = currencySchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("currencies").insert(toRow(parsed.data));

  if (error) {
    if (error.code === "23505") {
      return { error: "That currency code already exists." };
    }
    return { error: error.message };
  }

  revalidateCurrencyPaths();
  redirect("/admin/currencies?created=1");
}

export async function updateCurrency(
  code: string,
  values: CurrencyFormValues
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = currencySchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const normalized = code.trim().toUpperCase();
  if (parsed.data.code.toUpperCase() !== normalized) {
    return { error: "Currency code cannot be changed." };
  }

  const supabase = await createClient();
  const row = toRow(parsed.data);
  const { error } = await supabase
    .from("currencies")
    .update({
      name: row.name,
      symbol: row.symbol,
      decimal_places: row.decimal_places,
      is_active: row.is_active,
    })
    .eq("code", normalized);

  if (error) {
    return { error: error.message };
  }

  revalidateCurrencyPaths(normalized);
  redirect("/admin/currencies?updated=1");
}

export async function setCurrencyActive(
  code: string,
  isActive: boolean
): Promise<ActionResult | void> {
  await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase
    .from("currencies")
    .update({ is_active: isActive })
    .eq("code", code.trim().toUpperCase());

  if (error) return { error: error.message };

  revalidateCurrencyPaths(code.trim().toUpperCase());
}
