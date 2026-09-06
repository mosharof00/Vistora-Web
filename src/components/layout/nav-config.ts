import type { UserRole } from "@/lib/auth/roles";

export type NavIcon =
  | "dashboard"
  | "companies"
  | "agents"
  | "candidates"
  | "orders"
  | "batches"
  | "cases"
  | "payments"
  | "gateways"
  | "attendance"
  | "leave"
  | "salary"
  | "employees"
  | "documents"
  | "reports";

export type NavItem = {
  label: string;
  href: string;
  icon: NavIcon;
};

/** Manpower-first navigation per role. */
export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: "dashboard" },
    { label: "Employer Companies", href: "/admin/companies", icon: "companies" },
    { label: "Agents", href: "/admin/agents", icon: "agents" },
    { label: "Candidates", href: "/admin/candidates", icon: "candidates" },
    { label: "Job Orders", href: "/admin/job-orders", icon: "orders" },
    { label: "Visa Batches", href: "/admin/visa-batches", icon: "batches" },
    { label: "Cases", href: "/admin/cases", icon: "cases" },
    { label: "Payments", href: "/admin/payments", icon: "payments" },
    { label: "Company Payments", href: "/admin/company-payments", icon: "payments" },
    { label: "Payment Gateways", href: "/admin/payment-gateways", icon: "gateways" },
    { label: "Employees", href: "/admin/employees", icon: "employees" },
    { label: "Reports", href: "/admin/reports", icon: "reports" },
  ],
  staff: [
    { label: "Dashboard", href: "/staff", icon: "dashboard" },
    { label: "Candidates", href: "/staff/candidates", icon: "candidates" },
    { label: "Job Orders", href: "/staff/job-orders", icon: "orders" },
    { label: "Visa Batches", href: "/staff/visa-batches", icon: "batches" },
    { label: "Cases", href: "/staff/cases", icon: "cases" },
    { label: "Documents", href: "/staff/documents", icon: "documents" },
    { label: "Payments", href: "/staff/payments", icon: "payments" },
  ],
  hr: [
    { label: "Dashboard", href: "/hr", icon: "dashboard" },
    { label: "Employees", href: "/hr/employees", icon: "employees" },
    { label: "Attendance", href: "/hr/attendance", icon: "attendance" },
    { label: "Leave", href: "/hr/leave", icon: "leave" },
    { label: "Salary", href: "/hr/salary", icon: "salary" },
  ],
  office_assistant: [
    { label: "Dashboard", href: "/office", icon: "dashboard" },
    { label: "Attendance", href: "/office/attendance", icon: "attendance" },
  ],
  candidate: [
    { label: "Dashboard", href: "/candidate", icon: "dashboard" },
    { label: "My Case", href: "/candidate/case", icon: "cases" },
    { label: "Documents", href: "/candidate/documents", icon: "documents" },
    { label: "Payments", href: "/candidate/payments", icon: "payments" },
  ],
};
