import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/get-user";

export default async function OfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("office_assistant");

  return (
    <DashboardShell role="office_assistant" user={user}>
      {children}
    </DashboardShell>
  );
}
