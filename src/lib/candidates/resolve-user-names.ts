import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

/**
 * Resolve display names for auth user ids from employees + admins tables.
 */
export async function resolveUserDisplayNames(
  supabase: SupabaseClient<Database>,
  ids: Array<string | null | undefined>
): Promise<Map<string, string>> {
  const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  const map = new Map<string, string>();
  if (unique.length === 0) return map;

  const [{ data: employees }, { data: admins }] = await Promise.all([
    supabase.from("employees").select("id, full_name").in("id", unique),
    supabase.from("admins").select("id, full_name").in("id", unique),
  ]);

  for (const row of employees ?? []) map.set(row.id, row.full_name);
  for (const row of admins ?? []) {
    if (!map.has(row.id)) map.set(row.id, row.full_name);
  }
  return map;
}
