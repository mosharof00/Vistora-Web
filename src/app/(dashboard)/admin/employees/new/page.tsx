import { EmployeeForm } from "@/app/(dashboard)/admin/employees/employee-form";
import { PageBackLink } from "@/components/layout/page-back-link";

export default function NewEmployeePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <PageBackLink href="/admin/employees" label="Back to employees" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Invite employee
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          They receive an email to accept the invite and set a password.
        </p>
      </div>
      <EmployeeForm
        mode="create"
        defaultValues={{
          employeeCode: "",
          fullName: "",
          email: "",
          phone: "",
          nid: "",
          role: "staff",
          status: "active",
          department: "",
          designation: "",
          joiningDate: new Date().toISOString().slice(0, 10),
          basicSalaryBdt: 0,
        }}
      />
    </div>
  );
}
