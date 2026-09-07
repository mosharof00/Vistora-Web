import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  FolderOpen,
  HandCoins,
  Users,
  UserRound,
  Layers,
  ArrowRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  AdminDashboardStats,
  DashboardCase,
  DashboardJobOrder,
} from "@/lib/dashboard/admin";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

function formatBdt(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
      </div>
    </Link>
  );
}

const QUICK_LINKS = [
  { href: "/admin/companies", label: "Add company", icon: Building2 },
  { href: "/admin/agents", label: "Add agent", icon: UserRound },
  { href: "/admin/job-orders", label: "Job orders", icon: Briefcase },
  { href: "/admin/candidates", label: "Candidates", icon: Users },
  { href: "/admin/cases", label: "Cases", icon: FolderOpen },
  { href: "/admin/payments", label: "Payments", icon: HandCoins },
] as const;

export function AdminDashboardView({
  stats,
  jobOrders,
  cases,
}: {
  stats: AdminDashboardStats;
  jobOrders: DashboardJobOrder[];
  cases: DashboardCase[];
}) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manpower overview across parties, orders, and cases.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{today}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Open job orders"
          value={String(stats.openJobOrders)}
          hint={`${stats.seatsRemaining} seats remaining`}
          icon={Briefcase}
          href="/admin/job-orders"
        />
        <StatCard
          label="Active cases"
          value={String(stats.activeCases)}
          hint="In process pipeline"
          icon={FolderOpen}
          href="/admin/cases"
        />
        <StatCard
          label="Candidates"
          value={String(stats.candidates)}
          hint={`${stats.companies} companies · ${stats.agents} agents`}
          icon={Users}
          href="/admin/candidates"
        />
        <StatCard
          label="Payments this month"
          value={formatBdt(stats.paymentsThisMonthBdt)}
          hint={`${stats.employees} employees on roster`}
          icon={HandCoins}
          href="/admin/payments"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "gap-1.5")}
          >
            <Icon className="size-3.5" />
            {label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>Open job orders</CardTitle>
              <CardDescription>Quota still available to fill</CardDescription>
            </div>
            <Badge variant="secondary">{stats.openJobOrders}</Badge>
          </CardHeader>
          <CardContent>
            {jobOrders.length === 0 ? (
              <EmptyBlock
                title="No open orders yet"
                href="/admin/job-orders"
                action="Create job order"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">Order</th>
                      <th className="pb-2 pr-3 font-medium">Employer</th>
                      <th className="pb-2 pr-3 font-medium">Country</th>
                      <th className="pb-2 font-medium">Seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobOrders.map((order) => {
                      const remaining = Math.max(
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
                            </p>
                          </td>
                          <td className="py-3 pr-3 text-muted-foreground">
                            {order.employer_name ?? "—"}
                          </td>
                          <td className="py-3 pr-3 uppercase tabular-nums">
                            {order.country_code}
                          </td>
                          <td className="py-3">
                            <span
                              className={cn(
                                "font-medium tabular-nums",
                                remaining === 0
                                  ? "text-muted-foreground"
                                  : "text-foreground"
                              )}
                            >
                              {order.filled_count}/{order.required_count}
                            </span>
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({remaining} left)
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4">
              <Link
                href="/admin/job-orders"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all orders
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>Recent cases</CardTitle>
              <CardDescription>Latest candidate process files</CardDescription>
            </div>
            <Badge variant="secondary">{stats.activeCases} active</Badge>
          </CardHeader>
          <CardContent>
            {cases.length === 0 ? (
              <EmptyBlock
                title="No cases yet"
                href="/admin/cases"
                action="Open cases"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">Case</th>
                      <th className="pb-2 pr-3 font-medium">Candidate</th>
                      <th className="pb-2 pr-3 font-medium">Status</th>
                      <th className="pb-2 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-border/40 last:border-0"
                      >
                        <td className="py-3 pr-3">
                          <Link
                            href={`/admin/cases/${item.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {item.case_code}
                          </Link>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.order_code ?? "—"}
                          </p>
                        </td>
                        <td className="py-3 pr-3">
                          {item.candidate_name ?? "—"}
                        </td>
                        <td className="py-3 pr-3">
                          <StatusBadge tone={statusTone(item.overall_status)}>
                            {formatStatusLabel(item.overall_status)}
                          </StatusBadge>
                        </td>
                        <td className="py-3 text-muted-foreground tabular-nums">
                          {formatDate(item.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4">
              <Link
                href="/admin/cases"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all cases
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Party snapshot</CardTitle>
          <CardDescription>
            Admin-owned records that staff use day to day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <PartyTile
              href="/admin/companies"
              icon={Building2}
              label="Employer companies"
              value={stats.companies}
            />
            <PartyTile
              href="/admin/agents"
              icon={UserRound}
              label="Agents"
              value={stats.agents}
            />
            <PartyTile
              href="/admin/visa-batches"
              icon={Layers}
              label="Seats remaining"
              value={stats.seatsRemaining}
              hint="Across open job orders"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PartyTile({
  href,
  icon: Icon,
  label,
  value,
  hint,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3 transition-colors hover:bg-secondary"
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold tabular-nums">{value}</p>
        {hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    </Link>
  );
}

function EmptyBlock({
  title,
  href,
  action,
}: {
  title: string;
  href: string;
  action: string;
}) {
  return (
    <div className="rounded-xl bg-secondary/40 px-4 py-8 text-center">
      <p className="text-sm text-muted-foreground">{title}</p>
      <Link
        href={href}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-3")}
      >
        {action}
      </Link>
    </div>
  );
}
