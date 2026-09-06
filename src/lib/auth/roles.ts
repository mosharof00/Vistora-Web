import type { User } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

/**
 * Role enum as defined in the database (`user_role`).
 * Stored in `auth.users.raw_app_meta_data.role` — server-controlled only.
 */
export type UserRole = Database["public"]["Enums"]["user_role"];

export const ROLES = {
  admin: "admin",
  staff: "staff",
  hr: "hr",
  office_assistant: "office_assistant",
  candidate: "candidate",
} as const satisfies Record<UserRole, UserRole>;

export const LANDING_HOME = "/";

/** Root path of each role dashboard. */
export const ROLE_HOME: Record<UserRole, string> = {
  admin: "/admin",
  staff: "/staff",
  hr: "/hr",
  office_assistant: "/office",
  candidate: "/candidate",
};

/**
 * Always read role from `app_metadata` — never `user_metadata`
 * (client-editable).
 */
export function getUserRole(user: User | null): UserRole | null {
  const role = user?.app_metadata?.role;
  if (
    role === "admin" ||
    role === "staff" ||
    role === "hr" ||
    role === "office_assistant" ||
    role === "candidate"
  ) {
    return role;
  }
  return null;
}

export function dashboardPathForRole(role: UserRole | null): string {
  if (!role) return "/login";
  return ROLE_HOME[role];
}

export function isInternalRole(role: UserRole | null): boolean {
  return (
    role === "admin" ||
    role === "staff" ||
    role === "hr" ||
    role === "office_assistant"
  );
}
