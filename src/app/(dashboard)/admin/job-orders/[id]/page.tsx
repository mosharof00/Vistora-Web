import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Building2,
  Briefcase,
  CalendarDays,
  Clock3,
  FileText,
  Globe2,
  Pencil,
  Plane,
  Plus,
  Users,
} from "lucide-react";

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

export default async function JobOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const { id } = await params;
  const flash = await searchParams;
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
  const fillPct =
    order.required_count > 0
      ? Math.min(
          100,
          Math.round((order.filled_count / order.required_count) * 100)
        )
      : 0;

  const [{ data: batches }, { count: caseCount }] = await Promise.all([
    supabase
      .from("visa_batches")
      .select(
        "id, batch_code, title, status, quota_count, filled_count, visa_number"
      )
      .eq("job_order_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("candidate_cases")
      .select("id", { count: "exact", head: true })
      .eq("job_order_id", id),
  ]);

  const batchCount = batches?.length ?? 0;
  const ticketsCovered = order.ticket_provision !== "none";

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <ListFlashToast
          created={flash.created === "1"}
          updated={flash.updated === "1"}
          createdMessage="Job order created."
          updatedMessage="Job order updated."
          toastId={`job-order-${id}`}
        />
      </Suspense>

      <div>
        <PageBackLink href="/admin/job-orders" label="Back to job orders" />
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
            href={`/admin/job-orders/${order.id}/edit`}
            className={cn(buttonVariants(), "gap-1.5")}
          >
            <Pencil className="size-4" />
            Edit order
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
              ? `${order.salary_amount.toLocaleString()}`
              : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {order.salary_currency_code || "No currency"}
            {order.salary_bdt != null
              ? ` · ≈ ৳${Number(order.salary_bdt).toLocaleString()}`
              : ""}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Visa batches</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{batchCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Linked batches</p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Cases</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {caseCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Assigned workers</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Deal details</CardTitle>
          <CardDescription>
            Employer, destination, tickets, and contract terms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {company ? (
            <Link
              href={`/admin/companies/${company.id}`}
              className="flex items-start gap-3 rounded-2xl bg-secondary/55 px-4 py-4 ring-1 ring-border/50 transition-colors hover:bg-secondary/80"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="size-5" />
              </span>
              <span className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Employer company
                </p>
                <p className="mt-0.5 truncate text-base font-semibold text-foreground">
                  {company.trade_name || company.legal_name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {company.company_code}
                  {company.trade_name && company.legal_name !== company.trade_name
                    ? ` · ${company.legal_name}`
                    : ""}
                </p>
              </span>
            </Link>
          ) : (
            <div className="rounded-2xl bg-secondary/40 px-4 py-4 text-sm text-muted-foreground">
              No company linked
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <DetailTile
              icon={Briefcase}
              label="Category"
              value={category?.name ?? "—"}
            />
            <DetailTile
              icon={Globe2}
              label="Destination"
              value={countryLabel(order.country_code)}
              hint={order.country_code}
            />
            <DetailTile
              icon={Clock3}
              label="Contract"
              value={
                order.contract_duration_months
                  ? `${order.contract_duration_months} months`
                  : "—"
              }
            />
            <DetailTile
              icon={CalendarDays}
              label="Received"
              value={
                order.received_at
                  ? new Date(order.received_at).toLocaleDateString("en-GB")
                  : "—"
              }
            />
          </div>

          <div
            className={cn(
              "flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3.5 ring-1",
              ticketsCovered
                ? "bg-emerald-50/80 text-emerald-950 ring-emerald-200/70"
                : "bg-amber-50/80 text-amber-950 ring-amber-200/70"
            )}
          >
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl",
                ticketsCovered ? "bg-emerald-100" : "bg-amber-100"
              )}
            >
              <Plane className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide opacity-70">
                Ticket provision
              </p>
              <p className="text-sm font-semibold">
                {ticketLabel(order.ticket_provision)}
              </p>
            </div>
          </div>

          {order.salary_offer_text ? (
            <div className="rounded-2xl bg-secondary/40 px-4 py-3.5">
              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Offer text
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">
                    {order.salary_offer_text}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {order.notes ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-card px-4 py-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Notes
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                {order.notes}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Fill progress</CardTitle>
            <CardDescription>
              Seats filled as cases are assigned to this order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3">
              <Users className="size-4 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {order.filled_count} of {order.required_count} filled
                </p>
                <p className="text-xs text-muted-foreground">
                  {remaining} seats remaining · {fillPct}%
                </p>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${fillPct}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {caseCount ?? 0} case{(caseCount ?? 0) === 1 ? "" : "s"} linked to
              this order.
            </p>
            <Link
              href={`/admin/cases/new?order=${order.id}`}
              className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}
            >
              <Plus className="size-3.5" />
              New case
            </Link>
            <Link
              href="/admin/cases"
              className="ml-3 text-sm font-medium text-primary hover:underline"
            >
              View all cases
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>Visa batches</CardTitle>
              <CardDescription>
                Visa blocks / sheets under this deal
              </CardDescription>
            </div>
            <Link
              href={`/admin/visa-batches/new?order=${order.id}`}
              className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
            >
              <Plus className="size-3.5" />
              New batch
            </Link>
          </CardHeader>
          <CardContent>
            {batchCount === 0 ? (
              <div className="rounded-xl bg-secondary/40 px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No visa batches on this order yet.
                </p>
                <Link
                  href={`/admin/visa-batches/new?order=${order.id}`}
                  className={cn(buttonVariants({ size: "sm" }), "mt-3")}
                >
                  Create first batch
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {(batches ?? []).map((batch) => {
                  const quota = batch.quota_count ?? 0;
                  const filled = batch.filled_count ?? 0;
                  return (
                    <li
                      key={batch.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/admin/visa-batches/${batch.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {batch.batch_code}
                        </Link>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {batch.title}
                          {batch.visa_number ? ` · ${batch.visa_number}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {filled}/{quota || "—"}
                        </span>
                        <StatusBadge tone={statusTone(batch.status)}>
                          {formatStatusLabel(batch.status)}
                        </StatusBadge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <Link
              href="/admin/visa-batches"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              View all visa batches
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DetailTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-secondary/45 px-4 py-3.5 ring-1 ring-border/40">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5 shrink-0" />
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-sm font-semibold leading-snug">{value}</p>
      {hint ? (
        <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
