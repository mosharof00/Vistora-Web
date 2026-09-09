import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  Globe2,
  Layers,
  Plus,
  Users,
} from "lucide-react";

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
import {
  JOB_ORDER_COUNTRY_OPTIONS,
  TICKET_PROVISION_OPTIONS,
} from "@/lib/validations/job-order";
import { cn } from "@/lib/utils";

function ticketLabel(value: string) {
  return (
    TICKET_PROVISION_OPTIONS.find((o) => o.value === value)?.label ?? value
  );
}

function countryLabel(code: string) {
  return (
    JOB_ORDER_COUNTRY_OPTIONS.find((o) => o.code === code)?.label ?? code
  );
}

export default async function StaffJobOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("job_orders")
    .select(
      "*, employer_companies(id, company_code, trade_name, legal_name), job_categories(name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !order) notFound();

  const company = order.employer_companies as {
    id: string;
    company_code: string;
    trade_name: string | null;
    legal_name: string;
  } | null;
  const category = order.job_categories as { name: string } | null;
  const remaining = Math.max(0, order.required_count - order.filled_count);

  const [{ data: batches }, { data: cases }] = await Promise.all([
    supabase
      .from("visa_batches")
      .select(
        "id, batch_code, title, status, quota_count, filled_count, visa_number"
      )
      .eq("job_order_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("candidate_cases")
      .select(
        "id, case_code, overall_status, candidates(full_name, candidate_code)"
      )
      .eq("job_order_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <PageBackLink href="/staff/job-orders" label="Back to job orders" />
        <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {order.order_code}
              </h1>
              <StatusBadge tone={statusTone(order.status)}>
                {formatStatusLabel(order.status)}
              </StatusBadge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{order.title}</p>
          </div>
          <Link
            href={`/staff/cases/new?order=${order.id}`}
            className={cn(buttonVariants(), "gap-1.5")}
          >
            <Plus className="size-4" />
            Add case
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Workers</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {order.filled_count}/{order.required_count}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {remaining} seats left
          </p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Salary</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {order.salary_amount != null
              ? order.salary_amount.toLocaleString()
              : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {order.salary_currency_code || "No currency"}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Country</p>
          <p className="mt-2 text-lg font-semibold">
            {countryLabel(order.country_code)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {category?.name || "No category"}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Tickets</p>
          <p className="mt-2 text-lg font-semibold">
            {ticketLabel(order.ticket_provision)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
            <CardDescription>Employer and placement terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {company ? (
              <div className="flex items-start gap-3 rounded-2xl bg-secondary/55 px-4 py-4 ring-1 ring-border/50">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </span>
                <span className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Employer
                  </p>
                  <p className="mt-0.5 font-semibold">
                    {company.trade_name || company.legal_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {company.company_code}
                  </p>
                </span>
              </div>
            ) : null}

            <div className="flex items-center gap-2 rounded-2xl bg-secondary/40 px-4 py-3 text-sm">
              <Globe2 className="size-4 text-muted-foreground" />
              <span>{countryLabel(order.country_code)}</span>
            </div>

            {order.notes ? (
              <div className="rounded-2xl border border-dashed border-border/80 px-4 py-3.5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Notes
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm">
                  {order.notes}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              Visa batches
            </CardTitle>
            <CardDescription>
              {(batches ?? []).length} linked to this order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {(batches ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No visa batches yet.
              </p>
            ) : (
              (batches ?? []).map((batch) => {
                const seats =
                  batch.quota_count == null
                    ? null
                    : Math.max(0, batch.quota_count - batch.filled_count);
                return (
                  <Link
                    key={batch.id}
                    href={`/staff/visa-batches/${batch.id}`}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/45 px-4 py-3 ring-1 ring-border/40 transition-colors hover:bg-secondary/70"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{batch.batch_code}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {batch.title}
                        {seats != null ? ` · ${seats} left` : ""}
                      </p>
                    </div>
                    <StatusBadge tone={statusTone(batch.status)}>
                      {formatStatusLabel(batch.status)}
                    </StatusBadge>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            Recent cases
          </CardTitle>
          <CardDescription>
            {(cases ?? []).length} shown for this order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {(cases ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No cases assigned yet.{" "}
              <Link
                href={`/staff/cases/new?order=${order.id}`}
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
