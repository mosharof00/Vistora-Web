import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Building2,
  IdCard,
  Landmark,
  Mail,
  MapPin,
  Pencil,
  Percent,
  Phone,
  Wallet,
} from "lucide-react";

import { PageBackLink } from "@/components/layout/page-back-link";
import { ListFlashToast } from "@/components/layout/list-flash-toast";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { COMMISSION_TYPE_OPTIONS } from "@/lib/validations/agent";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

function commissionLabel(
  type: string,
  value: number
): { amount: string; typeLabel: string } {
  const typeLabel =
    COMMISSION_TYPE_OPTIONS.find((o) => o.value === type)?.label ??
    type.replaceAll("_", " ");
  if (type === "percent") {
    return { amount: `${value}%`, typeLabel };
  }
  return {
    amount: `৳${Number(value).toLocaleString("en-BD")}`,
    typeLabel,
  };
}

export default async function AgentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const { id } = await params;
  const flash = await searchParams;
  const supabase = await createClient();

  const [
    { data: agent, error },
    { count: candidateCount },
    { data: recentCandidates },
    { count: commissionCount },
  ] = await Promise.all([
    supabase.from("agents").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("candidates")
      .select("id", { count: "exact", head: true })
      .eq("primary_agent_id", id),
    supabase
      .from("candidates")
      .select("id, candidate_code, full_name, status, phone")
      .eq("primary_agent_id", id)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("agent_commissions")
      .select("id", { count: "exact", head: true })
      .eq("agent_id", id),
  ]);

  if (error || !agent) notFound();

  const commission = commissionLabel(
    agent.commission_type,
    Number(agent.commission_value)
  );

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <ListFlashToast
          created={flash.created === "1"}
          updated={flash.updated === "1"}
          createdMessage="Agent created."
          updatedMessage="Agent updated."
          toastId={`agent-${id}`}
        />
      </Suspense>

      <div>
        <PageBackLink href="/admin/agents" label="Back to agents" />
        <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-4">
            <Avatar name={agent.full_name} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {agent.full_name}
                </h1>
                <StatusBadge tone={statusTone(agent.status)}>
                  {formatStatusLabel(agent.status)}
                </StatusBadge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {agent.agent_code}
                {agent.agency_name ? ` · ${agent.agency_name}` : ""}
                {agent.district ? ` · ${agent.district}` : ""}
              </p>
            </div>
          </div>
          <Link
            href={`/admin/agents/${agent.id}/edit`}
            className={cn(buttonVariants(), "gap-1.5")}
          >
            <Pencil className="size-4" />
            Edit profile
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Candidates</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {candidateCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Referred workers</p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Commission</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {commission.amount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {commission.typeLabel}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Commission records</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {commissionCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Logged payouts</p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Contact</p>
          <p className="mt-2 truncate text-lg font-semibold">
            {agent.phone || agent.email || "—"}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {agent.phone && agent.email ? agent.email : "Primary"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Identity and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <DetailRow
              icon={<Building2 className="size-4" />}
              label="Agency"
              value={agent.agency_name}
            />
            <DetailRow
              icon={<Phone className="size-4" />}
              label="Phone"
              value={agent.phone}
            />
            <DetailRow
              icon={<Mail className="size-4" />}
              label="Email"
              value={agent.email}
            />
            <DetailRow
              icon={<MapPin className="size-4" />}
              label="District"
              value={agent.district}
            />
            <DetailRow
              icon={<MapPin className="size-4" />}
              label="Address"
              value={agent.address}
            />
            <DetailRow
              icon={<IdCard className="size-4" />}
              label="NID / trade license"
              value={agent.nid_or_trade_license}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Bank & commission</CardTitle>
            <CardDescription>Payout preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <DetailRow
              icon={<Percent className="size-4" />}
              label="Commission type"
              value={commission.typeLabel}
            />
            <DetailRow
              icon={<Wallet className="size-4" />}
              label="Commission value"
              value={commission.amount}
            />
            <DetailRow
              icon={<Landmark className="size-4" />}
              label="Bank"
              value={agent.bank_name}
            />
            <DetailRow
              icon={<Landmark className="size-4" />}
              label="Account"
              value={agent.bank_account}
            />
            {agent.notes ? (
              <div className="rounded-xl bg-secondary/40 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Notes
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm">{agent.notes}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle>Recent candidates</CardTitle>
            <CardDescription>
              Workers referred by this agent
            </CardDescription>
          </div>
          <Link
            href={`/admin/candidates?agent=${agent.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {(recentCandidates ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No candidates linked yet.
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {(recentCandidates ?? []).map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <Link
                      href={`/admin/candidates/${c.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {c.full_name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {c.candidate_code}
                      {c.phone ? ` · ${c.phone}` : ""}
                    </p>
                  </div>
                  <StatusBadge tone={statusTone(c.status)}>
                    {formatStatusLabel(c.status)}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-words font-medium">{value?.trim() || "—"}</p>
      </div>
    </div>
  );
}
