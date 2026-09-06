import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/get-user";

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireRole("candidate");

  return (
    <DashboardShell role="candidate" user={user}>
      {children}
    </DashboardShell>
  );
}
