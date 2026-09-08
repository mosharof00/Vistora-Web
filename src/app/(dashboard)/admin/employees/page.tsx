import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { EmployeesTable } from "@/app/(dashboard)/admin/employees/employees-table";
import { EmployeesFlashToast } from "@/app/(dashboard)/admin/employees/employees-flash-toast";
import { ListFilters } from "@/components/layout/list-filters";
import { buttonVariants } from "@/components/ui/button";
import { ilikeOr } from "@/lib/list-filters";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { EMPLOYEE_STATUS_OPTIONS } from "@/lib/validations/employee";

export default async function AdminEmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    q?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("employees")
    .select(
      "id, employee_code, full_name, email, phone, role, status, department, designation, avatar_path"
    )
    .order("created_at", { ascending: false });

  if (params.status) {
    query = query.eq("status", params.status);
  }
  const searchOr = params.q
    ? ilikeOr(
        ["full_name", "employee_code", "email", "phone", "department"],
        params.q
      )
    : null;
  if (searchOr) {
    query = query.or(searchOr);
  }

  const { data, error } = await query;

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load employees: {error.message}
      </div>
    );
  }

  const rows = (data ?? []).map((row) => ({
    id: row.id,
    employee_code: row.employee_code,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    status: row.status,
    department: row.department,
    designation: row.designation,
    has_avatar: Boolean(row.avatar_path),
  }));
  const activeCount = rows.filter((r) => r.status === "active").length;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <EmployeesFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} shown · {activeCount} active — staff, HR, office
          </p>
        </div>
        <Link
          href="/admin/employees/new"
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Invite employee
        </Link>
      </div>

      <Suspense fallback={null}>
        <ListFilters
          searchPlaceholder="Search name, code, email, department…"
          statusOptions={EMPLOYEE_STATUS_OPTIONS}
        />
      </Suspense>

      <EmployeesTable employees={rows} />
    </div>
  );
}
