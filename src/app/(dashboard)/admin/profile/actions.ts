"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import {
  adminProfileSchema,
  type AdminProfileInput,
} from "@/lib/validations/admin-profile";

type ActionResult = { error: string } | { ok: true };

function emptyToNull(value?: string) {
  const v = value?.trim();
  return v ? v : null;
}

export async function updateAdminProfile(
  values: AdminProfileInput
): Promise<ActionResult> {
  const { user } = await requireRole("admin");
  const parsed = adminProfileSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("admins")
    .update({
      full_name: parsed.data.fullName.trim(),
      phone: emptyToNull(parsed.data.phone),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/admin/profile");
  revalidatePath("/admin");
  return { ok: true };
}
