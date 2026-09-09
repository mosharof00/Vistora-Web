import { CasesListPage } from "@/components/cases/cases-list-page";
import { ADMIN_CASE_PATHS } from "@/lib/cases/paths";

export default async function AdminCasesPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    q?: string;
    status?: string;
    mine?: string;
  }>;
}) {
  const params = await searchParams;
  return <CasesListPage paths={ADMIN_CASE_PATHS} searchParams={params} />;
}
