import { AgentForm } from "@/app/(dashboard)/admin/agents/agent-form";
import { PageBackLink } from "@/components/layout/page-back-link";

export default function NewAgentPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <PageBackLink href="/admin/agents" label="Back to agents" />
        <h1 className="text-2xl font-semibold tracking-tight">Add agent</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a recruiting agent record for candidates and commissions.
        </p>
      </div>
      <AgentForm
        mode="create"
        defaultValues={{
          agentCode: "",
          fullName: "",
          agencyName: "",
          phone: "",
          email: "",
          district: "",
          address: "",
          nidOrTradeLicense: "",
          bankName: "",
          bankAccount: "",
          commissionType: "fixed",
          commissionValue: 0,
          status: "active",
          notes: "",
        }}
      />
    </div>
  );
}
