import type { User } from "@supabase/supabase-js";

import { DashboardShellClient } from "@/components/layout/dashboard-shell-client";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import type { UserRole } from "@/lib/auth/roles";

/**
 * Shared dashboard chrome (sidebar + topbar) for all roles.
 * Profile loading is best-effort until auth invite flow lands.
 */
export async function DashboardShell({
  role,
  user,
  children,
}: {
  role: UserRole;
  user: User;
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile(user.id, role);

  const displayName =
    profile?.fullName ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    "User";

  return (
    <DashboardShellClient
      role={role}
      displayName={displayName}
      email={profile?.email ?? user.email ?? ""}
      avatarUrl={profile?.avatarUrl}
      unreadCount={0}
    >
      {children}
    </DashboardShellClient>
  );
}
