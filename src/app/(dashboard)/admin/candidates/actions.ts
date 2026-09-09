"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { ROLE_HOME, type UserRole } from "@/lib/auth/roles";
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

function baseFor(role: UserRole) {
  return ROLE_HOME[role];
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
  const { user, role } = await requireRole(["admin", "staff"]);
  const parsed = candidateSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("candidates")
    .insert({
      ...toRow(parsed.data),
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "That candidate code is already in use." };
    }
    return { error: error.message };
  }

  const base = baseFor(role);
  revalidatePath(`${base}/candidates`);
  revalidatePath(base);
  revalidatePath("/admin/candidates");
  revalidatePath("/staff/candidates");
  redirect(`${base}/candidates/${data.id}?created=1`);
}

export async function updateCandidate(
  id: string,
  values: CandidateInput
): Promise<ActionResult | void> {
  const { user, role } = await requireRole(["admin", "staff"]);
  const parsed = candidateSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("candidates")
    .update({
      ...toRow(parsed.data),
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That candidate code is already in use." };
    }
    return { error: error.message };
  }

  const base = baseFor(role);
  revalidatePath(`${base}/candidates`);
  revalidatePath(`${base}/candidates/${id}`);
  revalidatePath(`${base}/candidates/${id}/edit`);
  revalidatePath("/admin/candidates");
  revalidatePath("/staff/candidates");
  redirect(`${base}/candidates/${id}?updated=1`);
}

export async function setCandidateStatus(
  id: string,
  status: CandidateInput["status"]
): Promise<ActionResult | void> {
  const { user } = await requireRole(["admin", "staff"]);
  const supabase = await createClient();
  const { error } = await supabase
    .from("candidates")
    .update({ status, updated_by: user.id })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/candidates");
  revalidatePath("/staff/candidates");
  revalidatePath(`/admin/candidates/${id}`);
  revalidatePath(`/staff/candidates/${id}`);
}
