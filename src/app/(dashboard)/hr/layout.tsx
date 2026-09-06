import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/get-user";

export default async function HrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("hr");

  return (
    <DashboardShell role="hr" user={user}>
      {children}
    </DashboardShell>
  );
}
