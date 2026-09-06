import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getUserRole, type UserRole } from "@/lib/auth/roles";

/**
 * Current authenticated user + role, or null. Cached per request.
 */
export const getAuthedUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, role: getUserRole(user) };
});

/**
 * Guards a Server Component. RLS remains the real security boundary.
 */
export async function requireRole(allowed: UserRole | UserRole[]) {
  const { user, role } = await getAuthedUser();

  if (!user) {
    redirect("/login");
  }

  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];
  if (!role || !allowedRoles.includes(role)) {
    redirect("/unauthorized");
  }

  return { user, role };
}
