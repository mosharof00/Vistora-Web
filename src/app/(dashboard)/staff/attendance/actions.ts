"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { error: string } | { ok: true; type: "in" | "out" };

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function punchAttendance(
  type: "in" | "out"
): Promise<ActionResult> {
  const { user } = await requireRole("staff");
  const supabase = await createClient();
  const now = new Date().toISOString();
  const workDate = todayDate();

  const { error: punchError } = await supabase.from("attendance_punches").insert({
    employee_id: user.id,
    punch_type: type,
    punched_at: now,
    source: "app",
    recorded_by: user.id,
  });

  if (punchError) return { error: punchError.message };

  // Best-effort day summary (may be denied by RLS for staff on some setups).
  const { data: existing } = await supabase
    .from("attendance_days")
    .select("id, check_in_at, check_out_at")
    .eq("employee_id", user.id)
    .eq("work_date", workDate)
    .maybeSingle();

  if (type === "in") {
    if (existing) {
      await supabase
        .from("attendance_days")
        .update({
          status: "present",
          check_in_at: existing.check_in_at ?? now,
          source: "app",
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("attendance_days").insert({
        employee_id: user.id,
        work_date: workDate,
        status: "present",
        check_in_at: now,
        source: "app",
      });
    }
  } else if (existing) {
    await supabase
      .from("attendance_days")
      .update({
        check_out_at: now,
        source: "app",
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("attendance_days").insert({
      employee_id: user.id,
      work_date: workDate,
      status: "present",
      check_out_at: now,
      source: "app",
    });
  }

  revalidatePath("/staff/attendance");
  revalidatePath("/staff");
  return { ok: true, type };
}
