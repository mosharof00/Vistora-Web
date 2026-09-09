import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, Plus, Users } from "lucide-react";

import { PageBackLink } from "@/components/layout/page-back-link";
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
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

export default async function StaffVisaBatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: batch, error } = await supabase
    .from("visa_batches")
    .select(
      "*, job_orders(id, order_code, title, employer_companies(trade_name, legal_name, company_code))"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !batch) notFound();

  const order = batch.job_orders as {
    id: string;
    order_code: string;
    title: string;
    employer_companies: {
      trade_name: string | null;
      legal_name: string;
      company_code: string;
    } | null;
  } | null;

  const company = order?.employer_companies ?? null;
  const quota = batch.quota_count;
  const remaining =
    quota != null ? Math.max(0, quota - batch.filled_count) : null;

  const { data: cases } = await supabase
    .from("candidate_cases")
    .select(
      "id, case_code, overall_status, candidates(full_name, candidate_code)"
    )
    .eq("visa_batch_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <PageBackLink href="/staff/visa-batches" label="Back to visa batches" />
        <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {batch.batch_code}
              </h1>
              <StatusBadge tone={statusTone(batch.status)}>
                {formatStatusLabel(batch.status)}
              </StatusBadge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{batch.title}</p>
          </div>
          <Link
            href={`/staff/cases/new?batch=${batch.id}`}
            className={cn(buttonVariants(), "gap-1.5")}
          >
            <Plus className="size-4" />
            Add case
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Seats</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {batch.filled_count}/{quota ?? "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {remaining != null ? `${remaining} left` : "No quota set"}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Cases</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {(cases ?? []).length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">In this batch</p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Visa number</p>
          <p className="mt-2 truncate text-lg font-semibold">
            {batch.visa_number || "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {batch.visa_id_number
              ? `ID ${batch.visa_id_number}`
              : "No visa ID"}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">PRO office</p>
          <p className="mt-2 text-lg font-semibold">
            {batch.pro_office || "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Processing office</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Batch details</CardTitle>
          <CardDescription>Parent order and identifiers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {order ? (
            <Link
              href={`/staff/job-orders/${order.id}`}
              className="flex items-start gap-3 rounded-2xl bg-secondary/55 px-4 py-4 ring-1 ring-border/50 transition-colors hover:bg-secondary/80"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Briefcase className="size-5" />
              </span>
              <span className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Job order
                </p>
                <p className="mt-0.5 font-semibold">{order.order_code}</p>
                <p className="text-xs text-muted-foreground">{order.title}</p>
                {company ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {company.trade_name || company.legal_name}
                  </p>
                ) : null}
              </span>
            </Link>
          ) : null}

          {batch.notes ? (
            <div className="rounded-2xl border border-dashed border-border/80 px-4 py-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Notes
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm">{batch.notes}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            Cases in batch
          </CardTitle>
          <CardDescription>
            {(cases ?? []).length} workers linked here
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {(cases ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No cases yet.{" "}
              <Link
                href={`/staff/cases/new?batch=${batch.id}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Add a case
              </Link>
            </p>
          ) : (
            (cases ?? []).map((row) => {
              const candidate = row.candidates as {
                full_name: string;
                candidate_code: string;
              } | null;
              return (
                <Link
                  key={row.id}
                  href={`/staff/cases/${row.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/45 px-4 py-3 ring-1 ring-border/40 transition-colors hover:bg-secondary/70"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{row.case_code}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {candidate
                        ? `${candidate.candidate_code} — ${candidate.full_name}`
                        : "No candidate"}
                    </p>
                  </div>
                  <StatusBadge tone={statusTone(row.overall_status)}>
                    {formatStatusLabel(row.overall_status)}
                  </StatusBadge>
                </Link>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
