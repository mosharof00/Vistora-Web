"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  employeeSchema,
  type EmployeeInput,
} from "@/lib/validations/employee";

type ActionResult = { error: string };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function emptyToNull(value?: string | null) {
  const v = value?.trim();
  return v ? v : null;
}

function toRow(values: EmployeeInput) {
  return {
    employee_code: values.employeeCode.trim().toUpperCase(),
    full_name: values.fullName.trim(),
    email: values.email.trim().toLowerCase(),
    phone: emptyToNull(values.phone),
    nid: emptyToNull(values.nid),
    role: values.role,
    status: values.status,
    department: emptyToNull(values.department),
    designation: emptyToNull(values.designation),
    joining_date: emptyToNull(values.joiningDate),
    basic_salary_bdt: values.basicSalaryBdt,
  };
}

function revalidateEmployeePaths(id?: string) {
  revalidatePath("/admin/employees");
  revalidatePath("/admin");
  revalidatePath("/hr/employees");
  if (id) {
    revalidatePath(`/admin/employees/${id}`);
    revalidatePath(`/admin/employees/${id}/edit`);
  }
}

export async function createEmployee(
  values: EmployeeInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = employeeSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const admin = createAdminClient();
  const email = parsed.data.email.trim().toLowerCase();
  const row = toRow(parsed.data);

  const { data: invited, error: inviteError } =
    await admin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: row.full_name,
        employee_code: row.employee_code,
      },
      redirectTo: `${SITE_URL}/auth/confirm?next=/set-password`,
    });

  if (inviteError || !invited.user) {
    return {
      error:
        inviteError?.message ??
        "Could not send invite. Check the email and try again.",
    };
  }

  const userId = invited.user.id;

  const { error: metaError } = await admin.auth.admin.updateUserById(userId, {
    app_metadata: { role: parsed.data.role },
    user_metadata: {
      full_name: row.full_name,
      employee_code: row.employee_code,
    },
  });

  if (metaError) {
    return { error: metaError.message };
  }

  const { error: profileError } = await admin.from("employees").upsert(
    {
      id: userId,
      ...row,
    },
    { onConflict: "id" }
  );

  if (profileError) {
    if (profileError.code === "23505") {
      return {
        error: "That employee code or email is already in use.",
      };
    }
    return { error: profileError.message };
  }

  revalidateEmployeePaths(userId);
  redirect(`/admin/employees/${userId}?created=1`);
}

export async function updateEmployee(
  id: string,
  values: EmployeeInput
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = employeeSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const row = toRow(parsed.data);
  const supabase = await createClient();
  const { error } = await supabase
    .from("employees")
    .update(row)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        error: "That employee code or email is already in use.",
      };
    }
    return { error: error.message };
  }

  // Keep auth role / email in sync (best-effort).
  try {
    const admin = createAdminClient();
    await admin.auth.admin.updateUserById(id, {
      email: row.email,
      app_metadata: { role: parsed.data.role },
      user_metadata: {
        full_name: row.full_name,
        employee_code: row.employee_code,
      },
    });
  } catch {
    // Profile saved; auth sync can be retried later.
  }

  revalidateEmployeePaths(id);
  redirect(`/admin/employees/${id}?updated=1`);
}

export async function resendEmployeeInvite(
  id: string
): Promise<ActionResult | void> {
  await requireRole("admin");
  const supabase = await createClient();
  const { data: employee, error } = await supabase
    .from("employees")
    .select("email, full_name, employee_code")
    .eq("id", id)
    .maybeSingle();

  if (error || !employee) {
    return { error: error?.message ?? "Employee not found." };
  }

  const admin = createAdminClient();
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    employee.email,
    {
      data: {
        full_name: employee.full_name,
        employee_code: employee.employee_code,
      },
      redirectTo: `${SITE_URL}/auth/confirm?next=/set-password`,
    }
  );

  if (inviteError) {
    return { error: inviteError.message };
  }
}
