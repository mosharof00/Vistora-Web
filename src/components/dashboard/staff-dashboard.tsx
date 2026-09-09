import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Briefcase,
  CalendarCheck,
  FolderOpen,
  HandCoins,
  Layers,
  Plus,
  Users,
} from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  StaffAttendanceToday,
  StaffAttentionItem,
  StaffCaseRow,
  StaffDashboardStats,
} from "@/lib/dashboard/staff";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

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

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const QUICK_ACTIONS = [
  {
    href: "/staff/candidates/new",
    label: "Add candidate",
    icon: Users,
  },
  {
    href: "/staff/cases/new",
    label: "New case",
    icon: FolderOpen,
  },
  {
    href: "/staff/payments/new",
    label: "Record payment",
    icon: HandCoins,
  },
  {
    href: "/staff/attendance",
    label: "Attendance",
    icon: CalendarCheck,
  },
] as const;

export function StaffDashboardView({
  displayName,
  stats,
  myCases,
  attention,
  attendanceToday,
}: {
  displayName: string;
  stats: StaffDashboardStats;
  myCases: StaffCaseRow[];
  attention: StaffAttentionItem[];
  attendanceToday: StaffAttendanceToday;
}) {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const attendanceLabel = attendanceToday.checkOutAt
    ? "Checked out"
    : attendanceToday.checkInAt
      ? "Checked in"
      : "Not checked in";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{today}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Hi, {displayName.split(" ")[0] || "there"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your manpower work queue for today.
          </p>
        </div>
        <Link
          href="/staff/attendance"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "gap-2 rounded-full"
          )}
        >
          <CalendarCheck className="size-4" />
          {attendanceLabel}
          <span className="text-muted-foreground">
            {formatTime(attendanceToday.checkInAt)}
            {attendanceToday.checkOutAt
              ? ` → ${formatTime(attendanceToday.checkOutAt)}`
              : ""}
          </span>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="My open cases"
          value={String(stats.myOpenCases)}
          hint="Assigned to you"
          icon={FolderOpen}
          href="/staff/cases?mine=1"
        />
        <StatCard
          label="Pipeline candidates"
          value={String(stats.pipelineCandidates)}
          hint="Lead → in process"
          icon={Users}
          href="/staff/candidates"
        />
        <StatCard
          label="Open job orders"
          value={String(stats.openJobOrders)}
          hint="Seats available"
          icon={Briefcase}
          href="/staff/job-orders?status=open"
        />
        <StatCard
          label="Payments this week"
          value={String(stats.paymentsThisWeek)}
          hint="Recorded entries"
          icon={HandCoins}
          href="/staff/payments"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "gap-1.5 rounded-full"
            )}
          >
            <action.icon className="size-3.5" />
            {action.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="shadow-sm xl:col-span-3">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
            <div>
              <CardTitle>My cases</CardTitle>
              <CardDescription>Cases assigned to you</CardDescription>
            </div>
            <Link
              href="/staff/cases?mine=1"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {myCases.length === 0 ? (
              <div className="rounded-xl bg-secondary/40 px-4 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No cases assigned to you yet.
                </p>
                <Link
                  href="/staff/cases/new"
                  className={cn(buttonVariants({ size: "sm" }), "mt-3 gap-1.5")}
                >
                  <Plus className="size-3.5" />
                  Create case
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {myCases.map((row) => (
                  <li key={row.id}>
                    <Link
                      href={`/staff/cases/${row.id}`}
                      className="flex flex-wrap items-center justify-between gap-2 py-3 transition-colors first:pt-0 last:pb-0 hover:text-primary"
                    >
                      <div className="min-w-0">
                        <p className="font-medium tabular-nums">
                          {row.case_code}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {[row.candidate_name, row.order_code]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge tone={statusTone(row.overall_status)}>
                          {formatStatusLabel(row.overall_status)}
                        </StatusBadge>
                        <ArrowRight className="size-3.5 text-muted-foreground" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>Needs attention</CardTitle>
            <CardDescription>Passports expiring within 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {attention.length === 0 ? (
              <p className="rounded-xl bg-secondary/40 px-4 py-8 text-center text-sm text-muted-foreground">
                Nothing urgent right now.
              </p>
            ) : (
              <ul className="space-y-2">
                {attention.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="block rounded-xl bg-secondary/40 px-3.5 py-3 ring-1 ring-border/40 transition-colors hover:bg-secondary/70"
                    >
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.detail}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/staff/job-orders"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <Layers className="size-3.5" />
              Browse job orders
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
