"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { ROLE_HOME, type UserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import {
  candidateCaseSchema,
  processStepUpdateSchema,
  type CandidateCaseInput,
  type ProcessStepUpdateInput,
} from "@/lib/validations/candidate-case";

type ActionResult = { error: string };

function emptyToNull(value?: string | null) {
  const v = value?.trim();
  return v ? v : null;
}

function baseFor(role: UserRole) {
  return ROLE_HOME[role];
}

function toRow(values: CandidateCaseInput) {
  return {
    case_code: values.caseCode.trim().toUpperCase(),
    candidate_id: values.candidateId,
    visa_batch_id: values.visaBatchId,
    job_order_id: values.jobOrderId,
    agent_id: emptyToNull(values.agentId),
    assigned_staff_id: emptyToNull(values.assignedStaffId),
    overall_status: values.overallStatus,
    mofa_number: emptyToNull(values.mofaNumber),
    processing_office: emptyToNull(values.processingOffice),
    trade_remark: emptyToNull(values.tradeRemark),
    flight_date: emptyToNull(values.flightDate),
    flight_number: emptyToNull(values.flightNumber),
    remarks: emptyToNull(values.remarks),
    deployed_at:
      values.overallStatus === "deployed" ? new Date().toISOString() : null,
  };
}

function revalidateCasePaths(
  id?: string,
  jobOrderId?: string,
  batchId?: string
) {
  revalidatePath("/admin/cases");
  revalidatePath("/staff/cases");
  revalidatePath("/admin");
  revalidatePath("/staff");
  if (id) {
    revalidatePath(`/admin/cases/${id}`);
    revalidatePath(`/admin/cases/${id}/edit`);
    revalidatePath(`/staff/cases/${id}`);
    revalidatePath(`/staff/cases/${id}/edit`);
  }
  if (jobOrderId) {
    revalidatePath(`/admin/job-orders/${jobOrderId}`);
    revalidatePath(`/staff/job-orders/${jobOrderId}`);
  }
  if (batchId) {
    revalidatePath(`/admin/visa-batches/${batchId}`);
    revalidatePath(`/staff/visa-batches/${batchId}`);
  }
}

export async function createCandidateCase(
  values: CandidateCaseInput
): Promise<ActionResult | void> {
  const { user, role } = await requireRole(["admin", "staff"]);
  const parsed = candidateCaseSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();

  const { data: batch } = await supabase
    .from("visa_batches")
    .select("id, job_order_id")
    .eq("id", parsed.data.visaBatchId)
    .maybeSingle();

  if (!batch) {
    return { error: "Selected visa batch was not found." };
  }

  const { data, error } = await supabase
    .from("candidate_cases")
    .insert({
      ...toRow({
        ...parsed.data,
        jobOrderId: batch.job_order_id,
      }),
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id, job_order_id, visa_batch_id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        error:
          "Case code already used, or this candidate is already in that batch.",
      };
    }
    return { error: error.message };
  }

  revalidateCasePaths(data.id, data.job_order_id, data.visa_batch_id);
  redirect(`${baseFor(role)}/cases/${data.id}?created=1`);
}

export async function updateCandidateCase(
  id: string,
  values: CandidateCaseInput
): Promise<ActionResult | void> {
  const { user, role } = await requireRole(["admin", "staff"]);
  const parsed = candidateCaseSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();

  const { data: batch } = await supabase
    .from("visa_batches")
    .select("id, job_order_id")
    .eq("id", parsed.data.visaBatchId)
    .maybeSingle();

  if (!batch) {
    return { error: "Selected visa batch was not found." };
  }

  const { data: existing } = await supabase
    .from("candidate_cases")
    .select("overall_status, deployed_at")
    .eq("id", id)
    .maybeSingle();

  const row = {
    ...toRow({
      ...parsed.data,
      jobOrderId: batch.job_order_id,
    }),
    updated_by: user.id,
  };

  if (parsed.data.overallStatus === "deployed") {
    row.deployed_at = existing?.deployed_at ?? new Date().toISOString();
  } else {
    row.deployed_at = null;
  }

  const { error } = await supabase
    .from("candidate_cases")
    .update(row)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        error:
          "Case code already used, or this candidate is already in that batch.",
      };
    }
    return { error: error.message };
  }

  revalidateCasePaths(id, batch.job_order_id, batch.id);
  redirect(`${baseFor(role)}/cases/${id}?updated=1`);
}

export async function updateCaseProcessStep(
  caseId: string,
  stepCode: string,
  values: ProcessStepUpdateInput
): Promise<ActionResult | void> {
  const { user } = await requireRole(["admin", "staff"]);
  const parsed = processStepUpdateSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the step fields and try again." };
  }

  const supabase = await createClient();
  const now = new Date().toISOString();
  const status = parsed.data.status;

  const { error } = await supabase
    .from("case_process_steps")
    .update({
      status,
      reference_no: emptyToNull(parsed.data.referenceNo),
      event_date: emptyToNull(parsed.data.eventDate),
      notes: emptyToNull(parsed.data.notes),
      started_at:
        status === "pending"
          ? null
          : status === "in_progress" || status === "done"
            ? now
            : undefined,
      completed_at: status === "done" ? now : null,
      updated_by: user.id,
    })
    .eq("candidate_case_id", caseId)
    .eq("step_code", stepCode);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/cases/${caseId}`);
  revalidatePath(`/staff/cases/${caseId}`);
}
