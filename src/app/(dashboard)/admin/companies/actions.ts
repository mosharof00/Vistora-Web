"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import {
  employerCompanySchema,
  type EmployerCompanyInput,
} from "@/lib/validations/employer-company";

type ActionResult = { error: string };

function emptyToNull(value?: string) {
  const v = value?.trim();
  return v ? v : null;
}

function toRow(values: EmployerCompanyInput) {
  return {
    company_code: values.companyCode.trim().toUpperCase(),
    legal_name: values.legalName.trim(),
    trade_name: emptyToNull(values.tradeName),
    country_code: values.countryCode,
    city: emptyToNull(values.city),
    address: emptyToNull(values.address),
    contact_person: emptyToNull(values.contactPerson),
    contact_phone: emptyToNull(values.contactPhone),
    contact_email: emptyToNull(values.contactEmail),
    license_or_cr_number: emptyToNull(values.licenseOrCrNumber),
    status: values.status,
    notes: emptyToNull(values.notes),
  };
}

export async function createEmployerCompany(
  values: EmployerCompanyInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = employerCompanySchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employer_companies")
    .insert(toRow(parsed.data))
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "That company code is already in use." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/companies");
  revalidatePath("/admin");
  redirect(`/admin/companies/${data.id}?created=1`);
}

export async function updateEmployerCompany(
  id: string,
  values: EmployerCompanyInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = employerCompanySchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("employer_companies")
    .update(toRow(parsed.data))
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That company code is already in use." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  revalidatePath(`/admin/companies/${id}/edit`);
  revalidatePath("/admin");
  redirect(`/admin/companies/${id}?updated=1`);
}

export async function setEmployerCompanyStatus(
  id: string,
  status: "active" | "inactive"
): Promise<ActionResult | void> {
  await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase
    .from("employer_companies")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  revalidatePath("/admin");
}
