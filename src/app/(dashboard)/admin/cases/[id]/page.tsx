import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Briefcase,
  Building2,
  CalendarDays,
  Plane,
  Pencil,
  UserRound,
} from "lucide-react";

import { CaseProcessSteps } from "@/app/(dashboard)/admin/cases/case-process-steps";
import { DocumentSlotsGrid } from "@/components/documents/document-slots";
import { PageBackLink } from "@/components/layout/page-back-link";
import { ListFlashToast } from "@/components/layout/list-flash-toast";
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
import { CASE_DOC_SLOTS } from "@/lib/documents/config";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

export default async function CaseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const { id } = await params;
  const flash = await searchParams;
  const supabase = await createClient();

  const { data: caseRow, error } = await supabase
    .from("candidate_cases")
    .select(
      `*,
      candidates(id, candidate_code, full_name, phone),
      visa_batches(id, batch_code, title, visa_number),
      job_orders(id, order_code, title, employer_companies(id, trade_name, legal_name, company_code)),
      agents(id, agent_code, full_name, agency_name),
      employees:assigned_staff_id(id, employee_code, full_name)`
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !caseRow) notFound();

  const candidate = caseRow.candidates as {
    id: string;
    candidate_code: string;
    full_name: string;
    phone: string | null;
  } | null;
  const batch = caseRow.visa_batches as {
    id: string;
    batch_code: string;
    title: string;
    visa_number: string | null;
  } | null;
  const order = caseRow.job_orders as {
    id: string;
    order_code: string;
    title: string;
    employer_companies: {
      id: string;
      trade_name: string | null;
      legal_name: string;
      company_code: string;
    } | null;
  } | null;
  const company = order?.employer_companies ?? null;
  const agent = caseRow.agents as {
    id: string;
    agent_code: string;
    full_name: string;
    agency_name: string | null;
  } | null;
  const staff = caseRow.employees as {
    id: string;
    employee_code: string;
    full_name: string;
  } | null;

  const [{ data: steps }, { data: stepDefs }, { data: caseDocs }] =
    await Promise.all([
      supabase
        .from("case_process_steps")
        .select("step_code, status, reference_no, event_date, notes")
        .eq("candidate_case_id", id),
      supabase
        .from("process_step_defs")
        .select("code, label, sort_order")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("documents")
        .select("id, doc_type, file_name, created_at")
        .eq("owner_type", "case")
        .eq("owner_id", id)
        .order("created_at", { ascending: false }),
    ]);

  const stepRows = (stepDefs ?? []).map((def) => {
    const step = (steps ?? []).find((s) => s.step_code === def.code);
    return {
      step_code: def.code,
      label: def.label,
      sort_order: def.sort_order,
      status: step?.status ?? "pending",
      reference_no: step?.reference_no ?? null,
      event_date: step?.event_date ?? null,
      notes: step?.notes ?? null,
    };
  });

  const doneCount = stepRows.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <ListFlashToast
          created={flash.created === "1"}
          updated={flash.updated === "1"}
          createdMessage="Case created."
          updatedMessage="Case updated."
          toastId={`case-${id}`}
        />
      </Suspense>

      <div>
        <PageBackLink href="/admin/cases" label="Back to cases" />
        <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {caseRow.case_code}
              </h1>
              <StatusBadge tone={statusTone(caseRow.overall_status)}>
                {formatStatusLabel(caseRow.overall_status)}
              </StatusBadge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {candidate?.full_name ?? "Candidate"}
              {batch ? ` · ${batch.batch_code}` : ""}
            </p>
          </div>
          <Link
            href={`/admin/cases/${caseRow.id}/edit`}
            className={cn(buttonVariants(), "gap-1.5")}
          >
            <Pencil className="size-4" />
            Edit case
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Pipeline</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {doneCount}/{stepRows.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Steps done</p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">MOFA</p>
          <p className="mt-2 truncate text-lg font-semibold">
            {caseRow.mofa_number || "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {caseRow.processing_office || "No office set"}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Flight</p>
          <p className="mt-2 text-lg font-semibold">
            {caseRow.flight_number || "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {caseRow.flight_date
              ? new Date(caseRow.flight_date).toLocaleDateString("en-GB")
              : "No date"}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Staff</p>
          <p className="mt-2 truncate text-lg font-semibold">
            {staff?.full_name || "Unassigned"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {staff?.employee_code || "No assignee"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Placement</CardTitle>
            <CardDescription>
              Candidate, batch, order, and company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {candidate ? (
              <Link
                href={`/admin/candidates/${candidate.id}`}
                className="flex items-start gap-3 rounded-2xl bg-secondary/55 px-4 py-4 ring-1 ring-border/50 transition-colors hover:bg-secondary/80"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserRound className="size-5" />
                </span>
                <span className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Candidate
                  </p>
                  <p className="mt-0.5 font-semibold">{candidate.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {candidate.candidate_code}
                    {candidate.phone ? ` · ${candidate.phone}` : ""}
                  </p>
                </span>
              </Link>
            ) : null}

            {batch ? (
              <Link
                href={`/admin/visa-batches/${batch.id}`}
                className="flex items-start gap-3 rounded-2xl bg-secondary/45 px-4 py-3.5 ring-1 ring-border/40 transition-colors hover:bg-secondary/70"
              >
                <Briefcase className="mt-0.5 size-4 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Visa batch</p>
                  <p className="font-medium">{batch.batch_code}</p>
                  <p className="text-xs text-muted-foreground">
                    {batch.title}
                    {batch.visa_number ? ` · ${batch.visa_number}` : ""}
                  </p>
                </div>
              </Link>
            ) : null}

            {order ? (
              <Link
                href={`/admin/job-orders/${order.id}`}
                className="flex items-start gap-3 rounded-2xl bg-secondary/45 px-4 py-3.5 ring-1 ring-border/40 transition-colors hover:bg-secondary/70"
              >
                <Briefcase className="mt-0.5 size-4 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Job order</p>
                  <p className="font-medium">{order.order_code}</p>
                  <p className="text-xs text-muted-foreground">{order.title}</p>
                </div>
              </Link>
            ) : null}

            {company ? (
              <Link
                href={`/admin/companies/${company.id}`}
                className="flex items-center gap-3 rounded-2xl bg-secondary/40 px-4 py-3 ring-1 ring-border/40 transition-colors hover:bg-secondary/70"
              >
                <Building2 className="size-4 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {company.trade_name || company.legal_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {company.company_code}
                  </p>
                </div>
              </Link>
            ) : null}

            {agent ? (
              <div className="rounded-2xl bg-secondary/40 px-4 py-3 text-sm">
                <p className="text-xs text-muted-foreground">Agent</p>
                <p className="font-medium">
                  {agent.agency_name || agent.full_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {agent.agent_code}
                </p>
              </div>
            ) : null}

            {(caseRow.flight_date || caseRow.flight_number) && (
              <div className="flex items-center gap-2 rounded-2xl bg-secondary/40 px-4 py-3 text-sm">
                <Plane className="size-4 text-muted-foreground" />
                <span>
                  {caseRow.flight_number || "Flight"}
                  {caseRow.flight_date
                    ? ` · ${new Date(caseRow.flight_date).toLocaleDateString("en-GB")}`
                    : ""}
                </span>
              </div>
            )}

            {caseRow.deployed_at ? (
              <div className="flex items-center gap-2 rounded-2xl bg-secondary/40 px-4 py-3 text-sm">
                <CalendarDays className="size-4 text-muted-foreground" />
                Deployed{" "}
                {new Date(caseRow.deployed_at).toLocaleDateString("en-GB")}
              </div>
            ) : null}

            {caseRow.remarks ? (
              <div className="rounded-2xl border border-dashed border-border/80 px-4 py-3.5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Remarks
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm">
                  {caseRow.remarks}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Process pipeline</CardTitle>
            <CardDescription>
              MOFA → medical → visa → BMET → flight
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CaseProcessSteps caseId={id} steps={stepRows} />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Case documents</CardTitle>
            <CardDescription>
              Processing proofs for this placement — drag &amp; drop or browse
            </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentSlotsGrid
            ownerType="case"
            ownerId={id}
            slots={CASE_DOC_SLOTS}
            documents={caseDocs ?? []}
            columnsClassName="sm:grid-cols-2 xl:grid-cols-4"
          />
        </CardContent>
      </Card>
    </div>
  );
}
