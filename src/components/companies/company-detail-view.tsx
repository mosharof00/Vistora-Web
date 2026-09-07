import Link from "next/link";
import {
  Building2,
  FileBadge,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Plane,
  UserRound,
  Users,
  Wallet,
  Pencil,
  Plus,
} from "lucide-react";

import { DocumentSlotsGrid } from "@/components/documents/document-slots";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EMPLOYER_DOC_SLOTS } from "@/lib/documents/config";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";
import type {
  CompanyDetailDoc,
  CompanyDetailOrder,
  CompanyDetailPayment,
} from "@/lib/companies/get-company-detail";
import type { Database } from "@/types/database.types";

type Company = Database["public"]["Tables"]["employer_companies"]["Row"];

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currency.length === 3 ? currency : "BDT",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function ticketLabel(value: string) {
  switch (value) {
    case "go_only":
      return "Go ticket by employer";
    case "return_only":
      return "Return ticket by employer";
    case "go_and_return":
      return "Go + return by employer";
    default:
      return "No ticket from employer";
  }
}

export function CompanyDetailView({
  company,
  jobOrders,
  documents,
  companyPayments,
  stats,
}: {
  company: Company;
  jobOrders: CompanyDetailOrder[];
  documents: CompanyDetailDoc[];
  companyPayments: CompanyDetailPayment[];
  stats: {
    openOrders: number;
    seatsRemaining: number;
    totalOrders: number;
    paymentsOut: number;
    paymentsIn: number;
    docCount: number;
  };
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {company.trade_name || company.legal_name}
            </h1>
            <StatusBadge tone={statusTone(company.status)}>
              {formatStatusLabel(company.status)}
            </StatusBadge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {company.company_code} · {company.country_code}
            {company.city ? ` · ${company.city}` : ""}
          </p>
          {company.trade_name ? (
            <p className="mt-0.5 text-sm text-muted-foreground">
              Legal: {company.legal_name}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/job-orders/new?company=${company.id}`}
            className={cn(buttonVariants({ variant: "secondary" }), "gap-1.5")}
          >
            <Plus className="size-4" />
            New job order
          </Link>
          <Link
            href={`/admin/companies/${company.id}/edit`}
            className={cn(buttonVariants(), "gap-1.5")}
          >
            <Pencil className="size-4" />
            Edit profile
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={Building2}
          label="Job orders"
          value={String(stats.totalOrders)}
          hint={`${stats.openOrders} open`}
        />
        <StatTile
          icon={Users}
          label="Seats remaining"
          value={String(stats.seatsRemaining)}
          hint="Across open orders"
        />
        <StatTile
          icon={Wallet}
          label="Paid to company"
          value={formatMoney(stats.paymentsOut, "BDT")}
          hint="investment_out"
        />
        <StatTile
          icon={Wallet}
          label="Received from company"
          value={formatMoney(stats.paymentsIn, "BDT")}
          hint="fees / reimbursements"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="shadow-sm xl:col-span-1">
          <CardHeader>
            <CardTitle>Company profile</CardTitle>
            <CardDescription>Party record (no login)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl bg-secondary/55 px-4 py-4 ring-1 ring-border/50">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserRound className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Primary contact
                  </p>
                  <p className="mt-0.5 text-base font-semibold">
                    {company.contact_person || "—"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {company.company_code}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <ProfileTile
                icon={Phone}
                label="Phone"
                value={company.contact_phone}
              />
              <ProfileTile
                icon={Mail}
                label="Email"
                value={company.contact_email}
              />
              <ProfileTile
                icon={FileBadge}
                label="License / CR"
                value={company.license_or_cr_number}
              />
              <ProfileTile
                icon={Globe2}
                label="Location"
                value={[company.city, company.country_code]
                  .filter(Boolean)
                  .join(" · ")}
              />
              <ProfileTile
                icon={MapPin}
                label="Address"
                value={company.address}
              />
            </div>

            {company.notes ? (
              <div className="rounded-2xl border border-dashed border-border/80 px-4 py-3.5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Notes
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                  {company.notes}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>Employer documents</CardTitle>
            <CardDescription>
              Company-level files: demand letter, visa advice, and other. Drag
              &amp; drop or browse — PDF/image up to 15 MB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentSlotsGrid
              ownerType="employer_company"
              ownerId={company.id}
              slots={EMPLOYER_DOC_SLOTS}
              documents={documents}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle>Job orders (deals)</CardTitle>
            <CardDescription>
              Worker quota, salary, and ticket responsibility live on each
              order — not on the company profile itself.
            </CardDescription>
          </div>
          <StatusBadge tone="info">{jobOrders.length}</StatusBadge>
        </CardHeader>
        <CardContent>
          {jobOrders.length === 0 ? (
            <div className="rounded-xl bg-secondary/40 px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No job orders for this company yet.
              </p>
              <Link
                href={`/admin/job-orders/new?company=${company.id}`}
                className={cn(buttonVariants({ size: "sm" }), "mt-3")}
              >
                Create job order
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/70 text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">Order</th>
                    <th className="pb-2 pr-3 font-medium">Workers</th>
                    <th className="pb-2 pr-3 font-medium">Salary</th>
                    <th className="pb-2 pr-3 font-medium">Tickets</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobOrders.map((order) => {
                    const left = Math.max(
                      0,
                      order.required_count - order.filled_count
                    );
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-border/40 last:border-0"
                      >
                        <td className="py-3 pr-3">
                          <Link
                            href={`/admin/job-orders/${order.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {order.order_code}
                          </Link>
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {order.title}
                            {order.category_name
                              ? ` · ${order.category_name}`
                              : ""}
                          </p>
                        </td>
                        <td className="py-3 pr-3 tabular-nums">
                          {order.filled_count}/{order.required_count}
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({left} left)
                          </span>
                        </td>
                        <td className="py-3 pr-3">
                          {order.salary_amount != null
                            ? `${order.salary_amount.toLocaleString()} ${order.salary_currency_code ?? ""}`
                            : "—"}
                        </td>
                        <td className="py-3 pr-3">
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Plane className="size-3.5" />
                            {ticketLabel(order.ticket_provision)}
                          </span>
                        </td>
                        <td className="py-3">
                          <StatusBadge tone={statusTone(order.status)}>
                            {formatStatusLabel(order.status)}
                          </StatusBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Company payments</CardTitle>
          <CardDescription>
            Money between Vistora and this employer (advances, fees,
            reimbursements) — separate from candidate fees.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {companyPayments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No company payments recorded yet. These will be managed under
              Finance → Company Payments.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/70 text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">When</th>
                    <th className="pb-2 pr-3 font-medium">Kind</th>
                    <th className="pb-2 pr-3 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {companyPayments.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="py-3 pr-3 tabular-nums text-muted-foreground">
                        {new Date(p.paid_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 pr-3">
                        <StatusBadge tone={statusTone(p.kind)}>
                          {formatStatusLabel(p.kind)}
                        </StatusBadge>
                      </td>
                      <td className="py-3 pr-3 font-medium tabular-nums">
                        {formatMoney(Number(p.amount), p.currency_code)}
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {p.reference_no || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4">
            <Link
              href={`/admin/company-payments?company=${company.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Open company payments
            </Link>
            <Link
              href={`/admin/company-payments/new?company=${company.id}`}
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "ml-3 gap-1.5"
              )}
            >
              <Plus className="size-3.5" />
              Record payment
            </Link>          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
    </div>
  );
}

function ProfileTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-secondary/45 px-3.5 py-3 ring-1 ring-border/40">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-medium">
          {value?.trim() ? value : "—"}
        </p>
      </div>
    </div>
  );
}
