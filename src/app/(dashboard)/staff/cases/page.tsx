import { CasesListPage } from "@/components/cases/cases-list-page";
import { requireRole } from "@/lib/auth/get-user";
import { STAFF_CASE_PATHS } from "@/lib/cases/paths";

export default async function StaffCasesPage({
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
  const { user } = await requireRole("staff");
  const params = await searchParams;
  return (
    <CasesListPage
      paths={STAFF_CASE_PATHS}
      searchParams={params}
      assignedStaffId={user.id}
    />
  );
}
