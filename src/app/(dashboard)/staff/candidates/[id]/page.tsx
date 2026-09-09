import { loadCandidateDetailPage } from "@/components/candidates/load-candidate-detail";
import { STAFF_CANDIDATE_PATHS } from "@/lib/candidates/paths";

export default async function StaffCandidateDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const { id } = await params;
  const flash = await searchParams;
  return loadCandidateDetailPage({
    id,
    paths: STAFF_CANDIDATE_PATHS,
    flash,
  });
}
