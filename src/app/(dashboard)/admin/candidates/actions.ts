"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import {
  candidateSchema,
  type CandidateInput,
} from "@/lib/validations/candidate";

type ActionResult = { error: string };

function emptyToNull(value?: string) {
  const v = value?.trim();
  return v ? v : null;
}

function toRow(values: CandidateInput) {
  return {
    candidate_code: values.candidateCode.trim().toUpperCase(),
    full_name: values.fullName.trim(),
    father_name: emptyToNull(values.fatherName),
    mother_name: emptyToNull(values.motherName),
    phone: emptyToNull(values.phone),
    email: emptyToNull(values.email),
    gender: values.gender ? values.gender : null,
    date_of_birth: emptyToNull(values.dateOfBirth),
    nationality: values.nationality,
    nid_number: emptyToNull(values.nidNumber),
    marital_status: values.maritalStatus ? values.maritalStatus : null,
    religion: emptyToNull(values.religion),
    present_address: emptyToNull(values.presentAddress),
    permanent_address: emptyToNull(values.permanentAddress),
    emergency_contact_name: emptyToNull(values.emergencyContactName),
    emergency_contact_phone: emptyToNull(values.emergencyContactPhone),
    status: values.status,
    source: values.source,
    primary_agent_id: emptyToNull(values.primaryAgentId),
  };
}

export async function createCandidate(
  values: CandidateInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = candidateSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("candidates")
    .insert(toRow(parsed.data))
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "That candidate code is already in use." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/candidates");
  revalidatePath("/admin");
  redirect(`/admin/candidates/${data.id}?created=1`);
}

export async function updateCandidate(
  id: string,
  values: CandidateInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = candidateSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("candidates")
    .update(toRow(parsed.data))
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That candidate code is already in use." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/candidates");
  revalidatePath(`/admin/candidates/${id}`);
  revalidatePath(`/admin/candidates/${id}/edit`);
  revalidatePath("/admin");
  redirect(`/admin/candidates/${id}?updated=1`);
}

export async function setCandidateStatus(
  id: string,
  status: CandidateInput["status"]
): Promise<ActionResult | void> {
  await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase
    .from("candidates")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/candidates");
  revalidatePath(`/admin/candidates/${id}`);
  revalidatePath("/admin");
}
