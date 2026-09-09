import "server-only";

import { createClient } from "@/lib/supabase/server";

export type StaffDashboardStats = {
  myOpenCases: number;
  pipelineCandidates: number;
  openJobOrders: number;
  paymentsThisWeek: number;
};

export type StaffCaseRow = {
  id: string;
  case_code: string;
  overall_status: string;
  created_at: string;
  candidate_name: string | null;
  order_code: string | null;
};

export type StaffAttentionItem = {
  id: string;
  kind: "passport" | "document" | "case";
  title: string;
  detail: string;
  href: string;
};

export type StaffAttendanceToday = {
  status: string | null;
  checkInAt: string | null;
  checkOutAt: string | null;
};

function startOfWeekIso() {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = (day + 6) % 7; // Monday start
  const monday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diff)
  );
  return monday.toISOString();
}

export async function getStaffDashboardData(staffUserId: string) {
  const supabase = await createClient();
  const weekStart = startOfWeekIso();
  const inThirtyDays = new Date();
  inThirtyDays.setDate(inThirtyDays.getDate() + 30);
  const expiryBefore = inThirtyDays.toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

  const [
    myOpenCases,
    pipelineCandidates,
    openJobOrders,
    weekPayments,
    assignedCases,
    expiringPassports,
    todayAttendance,
  ] = await Promise.all([
    supabase
      .from("candidate_cases")
      .select("id", { count: "exact", head: true })
      .eq("assigned_staff_id", staffUserId)
      .in("overall_status", ["registered", "processing", "cleared", "ticketed"]),
    supabase
      .from("candidates")
      .select("id", { count: "exact", head: true })
      .in("status", ["lead", "registered", "in_process"]),
    supabase
      .from("job_orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("payments")
      .select("id", { count: "exact", head: true })
      .gte("received_at", weekStart),
    supabase
      .from("candidate_cases")
      .select(
        "id, case_code, overall_status, created_at, candidates(full_name), job_orders(order_code)"
      )
      .eq("assigned_staff_id", staffUserId)
      .in("overall_status", ["registered", "processing", "cleared", "ticketed"])
      .order("updated_at", { ascending: false })
      .limit(8),
    supabase
      .from("passports")
      .select(
        "id, passport_number, expiry_date, candidate_id, candidates(full_name, candidate_code)"
      )
      .eq("is_current", true)
      .not("expiry_date", "is", null)
      .lte("expiry_date", expiryBefore)
      .order("expiry_date", { ascending: true })
      .limit(5),
    supabase
      .from("attendance_days")
      .select("status, check_in_at, check_out_at")
      .eq("employee_id", staffUserId)
      .eq("work_date", today)
      .maybeSingle(),
  ]);

  const stats: StaffDashboardStats = {
    myOpenCases: myOpenCases.count ?? 0,
    pipelineCandidates: pipelineCandidates.count ?? 0,
    openJobOrders: openJobOrders.count ?? 0,
    paymentsThisWeek: weekPayments.count ?? 0,
  };

  const myCases: StaffCaseRow[] = (assignedCases.data ?? []).map((row) => {
    const candidate = row.candidates as { full_name: string } | null;
    const order = row.job_orders as { order_code: string } | null;
    return {
      id: row.id,
      case_code: row.case_code,
      overall_status: row.overall_status,
      created_at: row.created_at,
      candidate_name: candidate?.full_name ?? null,
      order_code: order?.order_code ?? null,
    };
  });

  const attention: StaffAttentionItem[] = (expiringPassports.data ?? []).map(
    (row) => {
      const candidate = row.candidates as {
        full_name: string;
        candidate_code: string;
      } | null;
      return {
        id: row.id,
        kind: "passport" as const,
        title: row.passport_number,
        detail: `${candidate?.candidate_code ?? "Candidate"} · exp ${row.expiry_date}`,
        href: `/staff/passports/${row.id}`,
      };
    }
  );

  const attendanceToday: StaffAttendanceToday = {
    status: todayAttendance.data?.status ?? null,
    checkInAt: todayAttendance.data?.check_in_at ?? null,
    checkOutAt: todayAttendance.data?.check_out_at ?? null,
  };

  // Prefer punches if no day row yet (staff may only write punches under current RLS).
  if (!attendanceToday.checkInAt || !attendanceToday.checkOutAt) {
    const { data: punches } = await supabase
      .from("attendance_punches")
      .select("punch_type, punched_at")
      .eq("employee_id", staffUserId)
      .gte("punched_at", `${today}T00:00:00.000Z`)
      .lte("punched_at", `${today}T23:59:59.999Z`)
      .order("punched_at", { ascending: true });
    const checkIn =
      punches?.find((p) => p.punch_type === "in")?.punched_at ?? null;
    const checkOut =
      [...(punches ?? [])].reverse().find((p) => p.punch_type === "out")
        ?.punched_at ?? null;
    if (checkIn && !attendanceToday.checkInAt) {
      attendanceToday.checkInAt = checkIn;
      attendanceToday.status = attendanceToday.status ?? "present";
    }
    if (checkOut && !attendanceToday.checkOutAt) {
      attendanceToday.checkOutAt = checkOut;
    }
  }

  return { stats, myCases, attention, attendanceToday };
}
