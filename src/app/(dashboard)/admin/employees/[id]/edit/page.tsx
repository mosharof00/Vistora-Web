import { notFound } from "next/navigation";

import { EmployeeForm } from "@/app/(dashboard)/admin/employees/employee-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatStatusLabel, statusTone } from "@/lib/status";

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: employee, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !employee) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageBackLink
            href={`/admin/employees/${employee.id}`}
            label="Back to employee"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit employee
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {employee.employee_code} · {employee.full_name}
          </p>
        </div>
        <StatusBadge tone={statusTone(employee.status)}>
          {formatStatusLabel(employee.status)}
        </StatusBadge>
      </div>

      <EmployeeForm
        mode="edit"
        employeeId={employee.id}
        defaultValues={{
          employeeCode: employee.employee_code,
          fullName: employee.full_name,
          email: employee.email,
          phone: employee.phone ?? "",
          nid: employee.nid ?? "",
          role: employee.role,
          status: employee.status,
          department: employee.department ?? "",
          designation: employee.designation ?? "",
          joiningDate: employee.joining_date ?? "",
          basicSalaryBdt: Number(employee.basic_salary_bdt),
        }}
      />
    </div>
  );
}
