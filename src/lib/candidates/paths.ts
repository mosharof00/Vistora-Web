export type CandidateAreaPaths = {
  /** e.g. /admin/candidates or /staff/candidates */
  candidates: string;
  /** e.g. /admin/cases or /staff/cases */
  cases: string;
  /** e.g. /admin/passports or /staff/passports */
  passports: string;
  /** e.g. /admin/agents — null when role has no agents directory */
  agents: string | null;
};

export const ADMIN_CANDIDATE_PATHS: CandidateAreaPaths = {
  candidates: "/admin/candidates",
  cases: "/admin/cases",
  passports: "/admin/passports",
  agents: "/admin/agents",
};

export const STAFF_CANDIDATE_PATHS: CandidateAreaPaths = {
  candidates: "/staff/candidates",
  cases: "/staff/cases",
  passports: "/staff/passports",
  agents: null,
};
