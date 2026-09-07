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
  | "reports"
  | "categories"
  | "currencies"
  | "fees"
  | "expenses"
  | "commissions";

export type NavItem = {
  label: string;
  href: string;
  icon: NavIcon;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export type NavEntry = NavItem | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

/** Flat links for roles with short menus (or helpers). */
export function flattenNav(entries: NavEntry[]): NavItem[] {
  return entries.flatMap((entry) => (isNavGroup(entry) ? entry.items : [entry]));
}

function item(
  label: string,
  href: string,
  icon: NavIcon
): NavItem {
  return { label, href, icon };
}

function group(id: string, label: string, items: NavItem[]): NavGroup {
  return { id, label, items };
}

/**
 * Manpower-first navigation per role.
 * Admin uses collapsible groups; other roles stay flat.
 */
export const NAV_BY_ROLE: Record<UserRole, NavEntry[]> = {
  admin: [
    item("Dashboard", "/admin", "dashboard"),
    group("directory", "Directory", [
      item("Employer Companies", "/admin/companies", "companies"),
      item("Agents", "/admin/agents", "agents"),
      item("Candidates", "/admin/candidates", "candidates"),
      item("Employees", "/admin/employees", "employees"),
    ]),
    group("manpower", "Manpower", [
      item("Job Categories", "/admin/job-categories", "categories"),
      item("Job Orders", "/admin/job-orders", "orders"),
      item("Visa Batches", "/admin/visa-batches", "batches"),
      item("Cases", "/admin/cases", "cases"),
      item("Documents", "/admin/documents", "documents"),
    ]),
    group("finance", "Finance", [
      item("Fee Schedules", "/admin/fee-schedules", "fees"),
      item("Payments", "/admin/payments", "payments"),
      item("Company Payments", "/admin/company-payments", "payments"),
      item("Payment Gateways", "/admin/payment-gateways", "gateways"),
      item("Currencies", "/admin/currencies", "currencies"),
      item("Expenses", "/admin/expenses", "expenses"),
      item("Agent Commissions", "/admin/commissions", "commissions"),
    ]),
    group("hr", "HR", [
      item("Attendance", "/admin/attendance", "attendance"),
      item("Leave", "/admin/leave", "leave"),
      item("Salary", "/admin/salary", "salary"),
    ]),
    item("Reports", "/admin/reports", "reports"),
  ],
  staff: [
    item("Dashboard", "/staff", "dashboard"),
    item("Candidates", "/staff/candidates", "candidates"),
    item("Job Orders", "/staff/job-orders", "orders"),
    item("Visa Batches", "/staff/visa-batches", "batches"),
    item("Cases", "/staff/cases", "cases"),
    item("Documents", "/staff/documents", "documents"),
    item("Payments", "/staff/payments", "payments"),
  ],
  hr: [
    item("Dashboard", "/hr", "dashboard"),
    item("Employees", "/hr/employees", "employees"),
    item("Attendance", "/hr/attendance", "attendance"),
    item("Leave", "/hr/leave", "leave"),
    item("Salary", "/hr/salary", "salary"),
  ],
  office_assistant: [
    item("Dashboard", "/office", "dashboard"),
    item("Attendance", "/office/attendance", "attendance"),
  ],
  candidate: [
    item("Dashboard", "/candidate", "dashboard"),
    item("My Case", "/candidate/case", "cases"),
    item("Documents", "/candidate/documents", "documents"),
    item("Payments", "/candidate/payments", "payments"),
  ],
};
