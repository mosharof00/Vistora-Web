import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/get-user";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("staff");

  return (
    <DashboardShell role="staff" user={user}>
      {children}
    </DashboardShell>
  );
}
