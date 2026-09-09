import { CandidatesListPage } from "@/components/candidates/candidates-list-page";
import { ADMIN_CANDIDATE_PATHS } from "@/lib/candidates/paths";

export default async function AdminCandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    agent?: string;
    q?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;
  return (
    <CandidatesListPage paths={ADMIN_CANDIDATE_PATHS} searchParams={params} />
  );
}
