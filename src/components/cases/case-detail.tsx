import Link from "next/link";
import { Suspense } from "react";
import {
  Briefcase,
  Building2,
  CalendarDays,
  Pencil,
  Plane,
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
import type { CaseAreaPaths } from "@/lib/cases/paths";
import { CASE_DOC_SLOTS } from "@/lib/documents/config";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type CaseRow = Database["public"]["Tables"]["candidate_cases"]["Row"] & {
  candidates: {
    id: string;
    candidate_code: string;
    full_name: string;
    phone: string | null;
  } | null;
  visa_batches: {
    id: string;
    batch_code: string;
    title: string;
    visa_number: string | null;
  } | null;
  job_orders: {
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
  agents: {
    id: string;
    agent_code: string;
    full_name: string;
    agency_name: string | null;
  } | null;
  employees: {
    id: string;
    employee_code: string;
    full_name: string;
  } | null;
};

type StepRow = {
  step_code: string;
  label: string;
  sort_order: number;
  status: string;
  reference_no: string | null;
  event_date: string | null;
  notes: string | null;
};

type DocRow = {
  id: string;
  doc_type: string;
  file_name: string;
  created_at: string;
  uploaded_by_name?: string | null;
};

export function CaseDetailView({
  paths,
  caseRow,
  stepRows,
  docs,
  flash,
  createdByName,
  updatedByName,
}: {
  paths: CaseAreaPaths;
  caseRow: CaseRow;
  stepRows: StepRow[];
  docs: DocRow[];
  flash: { created?: string; updated?: string };
  createdByName?: string | null;
  updatedByName?: string | null;
}) {
  const candidate = caseRow.candidates;
  const batch = caseRow.visa_batches;
  const order = caseRow.job_orders;
  const company = order?.employer_companies ?? null;
  const agent = caseRow.agents;
  const staff = caseRow.employees;
  const doneCount = stepRows.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <ListFlashToast
          created={flash.created === "1"}
          updated={flash.updated === "1"}
          createdMessage="Case created."
          updatedMessage="Case updated."
          toastId={`case-${caseRow.id}`}
        />
      </Suspense>

      <div>
        <PageBackLink href={paths.cases} label="Back to cases" />
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
            {(createdByName || updatedByName) && (
              <p className="mt-1 text-xs text-muted-foreground">
                {[
                  createdByName ? `Created by ${createdByName}` : null,
                  updatedByName ? `Updated by ${updatedByName}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
          <Link
            href={`${paths.cases}/${caseRow.id}/edit`}
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
          <p className="text-sm text-muted-foreground">Assigned</p>
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
                href={`${paths.candidates}/${candidate.id}`}
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
                href={`${paths.visaBatches}/${batch.id}`}
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
                href={`${paths.jobOrders}/${order.id}`}
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
              paths.companies ? (
                <Link
                  href={`${paths.companies}/${company.id}`}
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
              ) : (
                <div className="flex items-center gap-3 rounded-2xl bg-secondary/40 px-4 py-3 ring-1 ring-border/40">
                  <Building2 className="size-4 text-primary" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {company.trade_name || company.legal_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {company.company_code}
                    </p>
                  </div>
                </div>
              )
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
            <CaseProcessSteps caseId={caseRow.id} steps={stepRows} />
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
            ownerId={caseRow.id}
            slots={CASE_DOC_SLOTS}
            documents={docs}
            columnsClassName="sm:grid-cols-2 xl:grid-cols-4"
          />
        </CardContent>
      </Card>
    </div>
  );
}
