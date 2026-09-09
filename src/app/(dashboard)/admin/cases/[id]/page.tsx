import { loadCaseDetailPage } from "@/components/cases/load-case-detail";
import { ADMIN_CASE_PATHS } from "@/lib/cases/paths";

export default async function CaseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const { id } = await params;
  const flash = await searchParams;
  return loadCaseDetailPage({
    id,
    paths: ADMIN_CASE_PATHS,
    flash,
  });
}
