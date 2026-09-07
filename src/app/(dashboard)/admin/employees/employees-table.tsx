"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

export type EmployeeListRow = {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  department: string | null;
  designation: string | null;
  has_avatar: boolean;
};

export function EmployeesTable({
  employees,
}: {
  employees: EmployeeListRow[];
}) {
  if (employees.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">No employees yet.</p>
        <Link
          href="/admin/employees/new"
          className={cn(buttonVariants(), "mt-4")}
        >
          Invite employee
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/40 text-muted-foreground">
              <th className="w-14 px-4 py-3 font-medium" />
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Employee</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-4 py-3">
                  <Avatar
                    name={row.full_name}
                    src={
                      row.has_avatar
                        ? `/api/avatars/employees/${row.id}`
                        : null
                    }
                    size="sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/employees/${row.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {row.employee_code}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{row.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.email}
                    {row.phone ? ` · ${row.phone}` : ""}
                  </p>
                </td>
                <td className="px-4 py-3 capitalize">
                  {formatStatusLabel(row.role)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <p>{row.department || "—"}</p>
                  <p className="text-xs">{row.designation || ""}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge tone={statusTone(row.status)}>
                    {formatStatusLabel(row.status)}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/employees/${row.id}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" })
                    )}
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/employees/${row.id}/edit`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "gap-1.5"
                    )}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
