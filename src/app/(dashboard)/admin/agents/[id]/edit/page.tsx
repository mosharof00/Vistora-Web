import { notFound } from "next/navigation";

import { AgentForm } from "@/app/(dashboard)/admin/agents/agent-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatStatusLabel, statusTone } from "@/lib/status";

export default async function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: agent, error } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !agent) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageBackLink
            href={`/admin/agents/${agent.id}`}
            label="Back to agent"
          />
          <h1 className="text-2xl font-semibold tracking-tight">Edit agent</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {agent.agent_code} · {agent.full_name}
          </p>
        </div>
        <StatusBadge tone={statusTone(agent.status)}>
          {formatStatusLabel(agent.status)}
        </StatusBadge>
      </div>

      <AgentForm
        mode="edit"
        agentId={agent.id}
        defaultValues={{
          agentCode: agent.agent_code,
          fullName: agent.full_name,
          agencyName: agent.agency_name ?? "",
          phone: agent.phone ?? "",
          email: agent.email ?? "",
          district: agent.district ?? "",
          address: agent.address ?? "",
          nidOrTradeLicense: agent.nid_or_trade_license ?? "",
          bankName: agent.bank_name ?? "",
          bankAccount: agent.bank_account ?? "",
          commissionType: agent.commission_type,
          commissionValue: Number(agent.commission_value),
          status: agent.status,
          notes: agent.notes ?? "",
        }}
      />
    </div>
  );
}
