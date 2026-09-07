import { AdminDashboardView } from "@/components/dashboard/admin-dashboard";
import { getAdminDashboardData } from "@/lib/dashboard/admin";

export default async function AdminHomePage() {
  const { stats, jobOrders, cases } = await getAdminDashboardData();

  return (
    <AdminDashboardView stats={stats} jobOrders={jobOrders} cases={cases} />
  );
}
