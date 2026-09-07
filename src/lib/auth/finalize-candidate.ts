import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

type ActionResult = { error: string };
type ActionSuccess = { error?: undefined };

export async function findAuthUserByEmail(email: string) {
  const admin = createAdminClient();
  const normalized = email.trim().toLowerCase();

  for (let page = 1; page <= 5; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) return { user: null, error: error.message };
    const match = data.users.find(
      (u) => (u.email ?? "").toLowerCase() === normalized
    );
    if (match) return { user: match, error: null };
    if (data.users.length < 200) break;
  }

  return { user: null, error: null };
}

/**
 * After public candidate signup OTP / email confirm:
 * set app_metadata.role = candidate and upsert public.candidates.
 */
export async function finalizeCandidateSignup(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}): Promise<ActionResult | ActionSuccess> {
  const admin = createAdminClient();

  const { error: roleError } = await admin.auth.admin.updateUserById(user.id, {
    app_metadata: {
      role: "candidate",
      provider: "email",
      providers: ["email"],
    },
  });
  if (roleError) return { error: roleError.message };

  const meta = user.user_metadata ?? {};
  const fullName = (meta.full_name as string) || "Candidate";
  const phone = (meta.phone as string) || null;
  const email = user.email ?? "";

  const { data: existing } = await admin
    .from("candidates")
    .select("id")
    .eq("email", email)
    .is("auth_user_id", null)
    .maybeSingle();

  if (existing) {
    const { error } = await admin
      .from("candidates")
      .update({
        auth_user_id: user.id,
        full_name: fullName,
        phone,
        status: "registered",
      })
      .eq("id", existing.id);
    if (error) return { error: error.message };
    return {};
  }

  const { data: alreadyLinked } = await admin
    .from("candidates")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (alreadyLinked) return {};

  const { error: insertError } = await admin.from("candidates").insert({
    auth_user_id: user.id,
    candidate_code: `CAND-${user.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`,
    full_name: fullName,
    email,
    phone,
    status: "registered",
    source: "direct",
  });

  if (insertError) {
    return {
      error:
        insertError.message ||
        "Could not create your candidate profile. Please try again.",
    };
  }
  return {};
}
