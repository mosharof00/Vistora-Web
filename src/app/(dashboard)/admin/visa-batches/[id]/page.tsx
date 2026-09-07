import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Briefcase,
  Building2,
  CalendarDays,
  Hash,
  MapPin,
  Pencil,
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
import { cn } from "@/lib/utils";

export default async function VisaBatchDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const { id } = await params;
  const flash = await searchParams;
  const supabase = await createClient();

  const { data: batch, error } = await supabase
    .from("visa_batches")
    .select(
      "*, job_orders(id, order_code, title, employer_companies(id, trade_name, legal_name, company_code))"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !batch) notFound();

  const order = batch.job_orders as {
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
  const quota = batch.quota_count;
  const remaining =
    quota != null ? Math.max(0, quota - batch.filled_count) : null;
  const fillPct =
    quota && quota > 0
      ? Math.min(100, Math.round((batch.filled_count / quota) * 100))
      : 0;

  const { data: cases } = await supabase
    .from("candidate_cases")
    .select(
      "id, case_code, overall_status, candidates(full_name, candidate_code)"
    )
    .eq("visa_batch_id", id)
    .order("created_at", { ascending: false });

  const caseCount = cases?.length ?? 0;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <ListFlashToast
          created={flash.created === "1"}
          updated={flash.updated === "1"}
          createdMessage="Visa batch created."
          updatedMessage="Visa batch updated."
          toastId={`visa-batch-${id}`}
        />
      </Suspense>

      <div>
        <PageBackLink href="/admin/visa-batches" label="Back to visa batches" />
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
            href={`/admin/visa-batches/${batch.id}/edit`}
            className={cn(buttonVariants(), "gap-1.5")}
          >
            <Pencil className="size-4" />
            Edit batch
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
            {caseCount ?? 0}
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
          <CardDescription>
            Parent job order, visa identifiers, and dates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {order ? (
            <Link
              href={`/admin/job-orders/${order.id}`}
              className="flex items-start gap-3 rounded-2xl bg-secondary/55 px-4 py-4 ring-1 ring-border/50 transition-colors hover:bg-secondary/80"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Briefcase className="size-5" />
              </span>
              <span className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Job order
                </p>
                <p className="mt-0.5 truncate text-base font-semibold">
                  {order.order_code}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {order.title}
                </p>
              </span>
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

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <DetailTile
              icon={Hash}
              label="Visa number"
              value={batch.visa_number || "—"}
            />
            <DetailTile
              icon={Hash}
              label="Visa ID"
              value={batch.visa_id_number || "—"}
            />
            <DetailTile
              icon={MapPin}
              label="PRO office"
              value={batch.pro_office || "—"}
            />
            <DetailTile
              icon={CalendarDays}
              label="Opened"
              value={
                batch.opened_at
                  ? new Date(batch.opened_at).toLocaleDateString("en-GB")
                  : "—"
              }
            />
          </div>

          {batch.closed_at ? (
            <div className="rounded-2xl bg-secondary/40 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Closed · </span>
              {new Date(batch.closed_at).toLocaleDateString("en-GB")}
            </div>
          ) : null}

          {batch.notes ? (
            <div className="rounded-2xl border border-dashed border-border/80 px-4 py-3.5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Notes
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                {batch.notes}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle>Cases in this batch</CardTitle>
            <CardDescription>
              Assigned workers · fill count auto-syncs
            </CardDescription>
          </div>
          <Link
            href={`/admin/cases/new?batch=${batch.id}`}
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            <Plus className="size-3.5" />
            New case
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3">
            <Users className="size-4 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {batch.filled_count}
                {quota != null ? ` of ${quota}` : ""} filled
              </p>
              <p className="text-xs text-muted-foreground">
                {remaining != null
                  ? `${remaining} seats left · ${fillPct}%`
                  : "Set a quota to track remaining seats"}
              </p>
            </div>
          </div>
          {quota != null ? (
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${fillPct}%` }}
              />
            </div>
          ) : null}

          {caseCount === 0 ? (
            <div className="rounded-xl bg-secondary/40 px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No cases assigned yet.
              </p>
              <Link
                href={`/admin/cases/new?batch=${batch.id}`}
                className={cn(buttonVariants({ size: "sm" }), "mt-3")}
              >
                Assign first candidate
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {(cases ?? []).map((row) => {
                const cand = row.candidates as {
                  full_name: string;
                  candidate_code: string;
                } | null;
                return (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/admin/cases/${row.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {row.case_code}
                      </Link>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {cand?.full_name}
                        {cand?.candidate_code
                          ? ` · ${cand.candidate_code}`
                          : ""}
                      </p>
                    </div>
                    <StatusBadge tone={statusTone(row.overall_status)}>
                      {formatStatusLabel(row.overall_status)}
                    </StatusBadge>
                  </li>
                );
              })}
            </ul>
          )}

          <Link
            href="/admin/cases"
            className="inline-block text-sm font-medium text-primary hover:underline"
          >
            View all cases
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-secondary/45 px-4 py-3.5 ring-1 ring-border/40">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5 shrink-0" />
        <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 break-all text-sm font-semibold leading-snug">
        {value}
      </p>
    </div>
  );
}
