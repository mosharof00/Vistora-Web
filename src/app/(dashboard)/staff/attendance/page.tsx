import { CalendarCheck } from "lucide-react";

import { AttendancePunchButtons } from "@/app/(dashboard)/staff/attendance/attendance-punch-buttons";
import { StaffPageHeader } from "@/components/layout/staff-page";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import { formatStatusLabel, statusTone } from "@/lib/status";

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default async function StaffAttendancePage() {
  const { user } = await requireRole("staff");
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = new Date();
  monthStart.setDate(1);
  const monthStartIso = monthStart.toISOString().slice(0, 10);

  const [{ data: todayDay }, { data: punchesToday }, { data: monthDays }] =
    await Promise.all([
      supabase
        .from("attendance_days")
        .select("status, check_in_at, check_out_at, notes")
        .eq("employee_id", user.id)
        .eq("work_date", today)
        .maybeSingle(),
      supabase
        .from("attendance_punches")
        .select("id, punch_type, punched_at")
        .eq("employee_id", user.id)
        .gte("punched_at", `${today}T00:00:00.000Z`)
        .order("punched_at", { ascending: true }),
      supabase
        .from("attendance_days")
        .select("id, work_date, status, check_in_at, check_out_at")
        .eq("employee_id", user.id)
        .gte("work_date", monthStartIso)
        .order("work_date", { ascending: false }),
    ]);

  const checkInAt =
    todayDay?.check_in_at ??
    punchesToday?.find((p) => p.punch_type === "in")?.punched_at ??
    null;
  const checkOutAt =
    todayDay?.check_out_at ??
    [...(punchesToday ?? [])].reverse().find((p) => p.punch_type === "out")
      ?.punched_at ??
    null;

  const presentDays = (monthDays ?? []).filter((d) =>
    ["present", "late", "half_day"].includes(d.status)
  ).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <StaffPageHeader
        title="My attendance"
        description="Check in and out for today — HR manages corrections"
      />

      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="bg-secondary/30">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="size-5 text-primary" />
                Today
              </CardTitle>
              <CardDescription className="mt-1">
                {formatDate(today)}
              </CardDescription>
            </div>
            {todayDay?.status || checkInAt ? (
              <StatusBadge
                tone={statusTone(todayDay?.status ?? "present")}
              >
                {formatStatusLabel(todayDay?.status ?? "present")}
              </StatusBadge>
            ) : (
              <StatusBadge tone="neutral">Not marked</StatusBadge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-secondary/40 px-4 py-3 ring-1 ring-border/40">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Check in
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {formatTime(checkInAt)}
              </p>
            </div>
            <div className="rounded-xl bg-secondary/40 px-4 py-3 ring-1 ring-border/40">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Check out
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {formatTime(checkOutAt)}
              </p>
            </div>
          </div>

          <AttendancePunchButtons
            hasCheckIn={Boolean(checkInAt)}
            hasCheckOut={Boolean(checkOutAt)}
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle>This month</CardTitle>
            <CardDescription>Your recorded attendance days</CardDescription>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{presentDays}</span>{" "}
            present days
          </p>
        </CardHeader>
        <CardContent>
          {(monthDays ?? []).length === 0 ? (
            <p className="rounded-xl bg-secondary/40 px-4 py-8 text-center text-sm text-muted-foreground">
              No attendance days recorded this month yet.
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {(monthDays ?? []).map((day) => (
                <li
                  key={day.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {formatDate(day.work_date)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(day.check_in_at)} →{" "}
                      {formatTime(day.check_out_at)}
                    </p>
                  </div>
                  <StatusBadge tone={statusTone(day.status)}>
                    {formatStatusLabel(day.status)}
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
