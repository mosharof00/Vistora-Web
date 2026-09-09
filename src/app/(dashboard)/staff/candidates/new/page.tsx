import { CandidateForm } from "@/app/(dashboard)/admin/candidates/candidate-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { createClient } from "@/lib/supabase/server";

export default async function StaffNewCandidatePage() {
  const supabase = await createClient();
  const { data: agents } = await supabase
    .from("agents")
    .select("id, full_name, agent_code")
    .eq("status", "active")
    .order("full_name");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <PageBackLink href="/staff/candidates" label="Back to candidates" />
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Add candidate
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Register a worker record. Login can be linked later.
        </p>
      </div>
      <CandidateForm
        mode="create"
        basePath="/staff/candidates"
        agents={agents ?? []}
        defaultValues={{
          candidateCode: "",
          fullName: "",
          fatherName: "",
          motherName: "",
          phone: "",
          email: "",
          gender: "",
          dateOfBirth: "",
          nationality: "BD",
          nidNumber: "",
          maritalStatus: "",
          religion: "",
          presentAddress: "",
          permanentAddress: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          status: "lead",
          source: "direct",
          primaryAgentId: "",
        }}
      />
    </div>
  );
}
