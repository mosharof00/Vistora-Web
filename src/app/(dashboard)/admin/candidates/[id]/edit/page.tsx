import { notFound } from "next/navigation";

import { CandidateForm } from "@/app/(dashboard)/admin/candidates/candidate-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatStatusLabel, statusTone } from "@/lib/status";

export default async function EditCandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: candidate, error }, { data: agents }] = await Promise.all([
    supabase.from("candidates").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("agents")
      .select("id, full_name, agent_code")
      .eq("status", "active")
      .order("full_name"),
  ]);

  if (error || !candidate) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageBackLink
            href={`/admin/candidates/${candidate.id}`}
            label="Back to candidate"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit candidate
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {candidate.candidate_code} · {candidate.full_name}
          </p>
        </div>
        <StatusBadge tone={statusTone(candidate.status)}>
          {formatStatusLabel(candidate.status)}
        </StatusBadge>
      </div>

      <CandidateForm
        mode="edit"
        candidateId={candidate.id}
        agents={agents ?? []}
        defaultValues={{
          candidateCode: candidate.candidate_code,
          fullName: candidate.full_name,
          fatherName: candidate.father_name ?? "",
          motherName: candidate.mother_name ?? "",
          phone: candidate.phone ?? "",
          email: candidate.email ?? "",
          gender: candidate.gender ?? "",
          dateOfBirth: candidate.date_of_birth ?? "",
          nationality: candidate.nationality || "BD",
          nidNumber: candidate.nid_number ?? "",
          maritalStatus: candidate.marital_status ?? "",
          religion: candidate.religion ?? "",
          presentAddress: candidate.present_address ?? "",
          permanentAddress: candidate.permanent_address ?? "",
          emergencyContactName: candidate.emergency_contact_name ?? "",
          emergencyContactPhone: candidate.emergency_contact_phone ?? "",
          status: candidate.status,
          source: candidate.source,
          primaryAgentId: candidate.primary_agent_id ?? "",
        }}
      />
    </div>
  );
}
