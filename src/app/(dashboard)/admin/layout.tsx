import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/get-user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("admin");

  return (
    <DashboardShell role="admin" user={user}>
      {children}
    </DashboardShell>
  );
}
