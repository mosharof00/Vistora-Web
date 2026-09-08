import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/auth/roles";

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: string;
  role: UserRole;
};

function avatarApiUrl(
  kind: "admins" | "employees" | "candidates",
  id: string,
  hasPath: string | null
): string | null {
  if (!hasPath) return null;
  if (hasPath.startsWith("http")) return hasPath;
  return `/api/avatars/${kind}/${id}`;
}

export const getCurrentProfile = cache(async function getCurrentProfile(
  userId: string,
  role: UserRole
): Promise<UserProfile | null> {
  const supabase = await createClient();

  if (role === "admin") {
    const { data } = await supabase
      .from("admins")
      .select("id, full_name, email, phone, avatar_path, created_at")
      .eq("id", userId)
      .maybeSingle();

    if (!data) return null;

    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      avatarUrl: avatarApiUrl("admins", data.id, data.avatar_path),
      createdAt: data.created_at,
      role,
    };
  }

  if (role === "staff" || role === "hr" || role === "office_assistant") {
    const { data } = await supabase
      .from("employees")
      .select("id, full_name, email, phone, avatar_path, created_at")
      .eq("id", userId)
      .maybeSingle();

    if (!data) return null;

    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      avatarUrl: avatarApiUrl("employees", data.id, data.avatar_path),
      createdAt: data.created_at,
      role,
    };
  }

  const { data } = await supabase
    .from("candidates")
    .select("id, full_name, email, phone, photo_path, created_at")
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email ?? "",
    phone: data.phone,
    avatarUrl: avatarApiUrl("candidates", data.id, data.photo_path),
    createdAt: data.created_at,
    role,
  };
});
