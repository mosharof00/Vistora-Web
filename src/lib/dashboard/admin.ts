import "server-only";

import { createClient } from "@/lib/supabase/server";

export type AdminDashboardStats = {
  openJobOrders: number;
  activeCases: number;
  seatsRemaining: number;
  candidates: number;
  companies: number;
  agents: number;
  paymentsThisMonthBdt: number;
  employees: number;
};

export type DashboardJobOrder = {
  id: string;
  order_code: string;
  title: string;
  country_code: string;
  required_count: number;
  filled_count: number;
  status: string;
  employer_name: string | null;
};

export type DashboardCase = {
  id: string;
  case_code: string;
  overall_status: string;
  created_at: string;
  candidate_name: string | null;
  order_code: string | null;
};

const ACTIVE_CASE_STATUSES = [
  "registered",
  "processing",
  "cleared",
  "ticketed",
] as const;

function startOfMonthIso() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export async function getAdminDashboardData() {
  const supabase = await createClient();
  const monthStart = startOfMonthIso();

  const [
    openOrders,
    activeCases,
    openOrdersForSeats,
    candidates,
    companies,
    agents,
    employees,
    monthPayments,
    recentOrders,
    recentCases,
  ] = await Promise.all([
    supabase
      .from("job_orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("candidate_cases")
      .select("id", { count: "exact", head: true })
      .in("overall_status", [...ACTIVE_CASE_STATUSES]),
    supabase
      .from("job_orders")
      .select("required_count, filled_count")
      .eq("status", "open"),
    supabase.from("candidates").select("id", { count: "exact", head: true }),
    supabase
      .from("employer_companies")
      .select("id", { count: "exact", head: true }),
    supabase.from("agents").select("id", { count: "exact", head: true }),
    supabase.from("employees").select("id", { count: "exact", head: true }),
    supabase
      .from("payments")
      .select("amount_bdt")
      .gte("received_at", monthStart),
    supabase
      .from("job_orders")
      .select(
        "id, order_code, title, country_code, required_count, filled_count, status, employer_companies(legal_name, trade_name)"
      )
      .eq("status", "open")
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("candidate_cases")
      .select(
        "id, case_code, overall_status, created_at, candidates(full_name), job_orders(order_code)"
      )
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const seatsRemaining = (openOrdersForSeats.data ?? []).reduce((sum, row) => {
    return sum + Math.max(0, (row.required_count ?? 0) - (row.filled_count ?? 0));
  }, 0);

  const paymentsThisMonthBdt = (monthPayments.data ?? []).reduce(
    (sum, row) => sum + Number(row.amount_bdt ?? 0),
    0
  );

  const stats: AdminDashboardStats = {
    openJobOrders: openOrders.count ?? 0,
    activeCases: activeCases.count ?? 0,
    seatsRemaining,
    candidates: candidates.count ?? 0,
    companies: companies.count ?? 0,
    agents: agents.count ?? 0,
    paymentsThisMonthBdt,
    employees: employees.count ?? 0,
  };

  const jobOrders: DashboardJobOrder[] = (recentOrders.data ?? []).map((row) => {
    const company = row.employer_companies as {
      legal_name: string;
      trade_name: string | null;
    } | null;
    return {
      id: row.id,
      order_code: row.order_code,
      title: row.title,
      country_code: row.country_code,
      required_count: row.required_count,
      filled_count: row.filled_count,
      status: row.status,
      employer_name: company?.trade_name || company?.legal_name || null,
    };
  });

  const cases: DashboardCase[] = (recentCases.data ?? []).map((row) => {
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

  return { stats, jobOrders, cases };
}
