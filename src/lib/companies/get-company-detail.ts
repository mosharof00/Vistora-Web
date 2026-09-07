import "server-only";

import { createClient } from "@/lib/supabase/server";

export type CompanyDetailDoc = {
  id: string;
  doc_type: string;
  file_name: string;
  storage_path: string;
  created_at: string;
};

export type CompanyDetailOrder = {
  id: string;
  order_code: string;
  title: string;
  status: string;
  country_code: string;
  required_count: number;
  filled_count: number;
  salary_amount: number | null;
  salary_currency_code: string | null;
  ticket_provision: string;
  category_name: string | null;
};

export type CompanyDetailPayment = {
  id: string;
  kind: string;
  amount: number;
  currency_code: string;
  method: string;
  paid_at: string;
  reference_no: string | null;
  notes: string | null;
};

export async function getEmployerCompanyDetail(id: string) {
  const supabase = await createClient();

  const [
    { data: company, error: companyError },
    { data: orders },
    { data: docs },
    { data: payments },
  ] = await Promise.all([
    supabase.from("employer_companies").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("job_orders")
      .select(
        "id, order_code, title, status, country_code, required_count, filled_count, salary_amount, salary_currency_code, ticket_provision, job_categories(name)"
      )
      .eq("employer_company_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("documents")
      .select("id, doc_type, file_name, storage_path, created_at")
      .eq("owner_type", "employer_company")
      .eq("owner_id", id)
      .in("doc_type", ["demand_letter", "visa_advice", "employer_other"])
      .order("created_at", { ascending: false }),
    supabase
      .from("company_payments")
      .select(
        "id, kind, amount, currency_code, method, paid_at, reference_no, notes"
      )
      .eq("employer_company_id", id)
      .order("paid_at", { ascending: false })
      .limit(20),
  ]);

  if (companyError || !company) {
    return { company: null, error: companyError?.message ?? "Not found" };
  }

  const jobOrders: CompanyDetailOrder[] = (orders ?? []).map((row) => {
    const cat = row.job_categories as { name: string } | null;
    return {
      id: row.id,
      order_code: row.order_code,
      title: row.title,
      status: row.status,
      country_code: row.country_code,
      required_count: row.required_count,
      filled_count: row.filled_count,
      salary_amount: row.salary_amount,
      salary_currency_code: row.salary_currency_code,
      ticket_provision: row.ticket_provision,
      category_name: cat?.name ?? null,
    };
  });

  const documents: CompanyDetailDoc[] = docs ?? [];
  const companyPayments: CompanyDetailPayment[] = payments ?? [];

  const seatsRemaining = jobOrders
    .filter((o) => o.status === "open")
    .reduce(
      (sum, o) => sum + Math.max(0, o.required_count - o.filled_count),
      0
    );

  const openOrders = jobOrders.filter((o) => o.status === "open").length;
  const paymentsOut = companyPayments
    .filter((p) => p.kind === "investment_out")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const paymentsIn = companyPayments
    .filter((p) => p.kind === "reimbursement_in" || p.kind === "fee_in")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return {
    company,
    jobOrders,
    documents,
    companyPayments,
    stats: {
      openOrders,
      seatsRemaining,
      totalOrders: jobOrders.length,
      paymentsOut,
      paymentsIn,
      docCount: documents.length,
    },
    error: null as string | null,
  };
}
