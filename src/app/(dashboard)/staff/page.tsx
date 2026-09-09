import { StaffDashboardView } from "@/components/dashboard/staff-dashboard";
import { requireRole } from "@/lib/auth/get-user";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import { getStaffDashboardData } from "@/lib/dashboard/staff";

export default async function StaffHomePage() {
  const { user } = await requireRole("staff");
  const [profile, data] = await Promise.all([
    getCurrentProfile(user.id, "staff"),
    getStaffDashboardData(user.id),
  ]);

  return (
    <StaffDashboardView
      displayName={profile?.fullName ?? user.email ?? "Staff"}
      stats={data.stats}
      myCases={data.myCases}
      attention={data.attention}
      attendanceToday={data.attendanceToday}
    />
  );
}
