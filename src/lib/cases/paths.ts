export type CaseAreaPaths = {
  cases: string;
  candidates: string;
  visaBatches: string;
  jobOrders: string;
  /** null when role has no companies directory */
  companies: string | null;
  /** null when role has no agents directory */
  agents: string | null;
};

export const ADMIN_CASE_PATHS: CaseAreaPaths = {
  cases: "/admin/cases",
  candidates: "/admin/candidates",
  visaBatches: "/admin/visa-batches",
  jobOrders: "/admin/job-orders",
  companies: "/admin/companies",
  agents: "/admin/agents",
};

export const STAFF_CASE_PATHS: CaseAreaPaths = {
  cases: "/staff/cases",
  candidates: "/staff/candidates",
  visaBatches: "/staff/visa-batches",
  jobOrders: "/staff/job-orders",
  companies: null,
  agents: null,
};
