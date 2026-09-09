"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import {
  STORAGE_BUCKETS,
  buildAvatarPath,
  extensionFromFileName,
} from "@/lib/storage/paths";

type ActionResult = { error: string } | { ok: true };

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX = 5 * 1024 * 1024;

function mimeOk(file: File) {
  if (!file || file.size === 0) return "Choose an image.";
  if (file.size > MAX) return "Image must be 5 MB or smaller.";
  if (!ALLOWED.has(file.type)) return "Use JPG, PNG, WebP, or AVIF.";
  return null;
}

export async function uploadEmployeeAvatar(
  employeeId: string,
  formData: FormData
): Promise<ActionResult> {
  await requireRole("admin");
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Choose an image." };
  const err = mimeOk(file);
  if (err) return { error: err };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("employees")
    .select("avatar_path")
    .eq("id", employeeId)
    .maybeSingle();

  const ext = extensionFromFileName(file.name) || "jpg";
  const path = buildAvatarPath("employees", employeeId, randomUUID(), ext);
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) return { error: uploadError.message };

  const { error: updateError } = await supabase
    .from("employees")
    .update({ avatar_path: path })
    .eq("id", employeeId);

  if (updateError) {
    await supabase.storage.from(STORAGE_BUCKETS.avatars).remove([path]);
    return { error: updateError.message };
  }

  if (existing?.avatar_path && existing.avatar_path !== path) {
    await supabase.storage
      .from(STORAGE_BUCKETS.avatars)
      .remove([existing.avatar_path]);
  }

  revalidatePath(`/admin/employees/${employeeId}`);
  revalidatePath("/admin/employees");
  return { ok: true };
}

export async function uploadCandidatePhoto(
  candidateId: string,
  formData: FormData
): Promise<ActionResult> {
  await requireRole(["admin", "staff"]);
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Choose an image." };
  const err = mimeOk(file);
  if (err) return { error: err };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("candidates")
    .select("photo_path")
    .eq("id", candidateId)
    .maybeSingle();

  const ext = extensionFromFileName(file.name) || "jpg";
  const path = buildAvatarPath("candidates", candidateId, randomUUID(), ext);
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) return { error: uploadError.message };

  const { error: updateError } = await supabase
    .from("candidates")
    .update({ photo_path: path })
    .eq("id", candidateId);

  if (updateError) {
    await supabase.storage.from(STORAGE_BUCKETS.avatars).remove([path]);
    return { error: updateError.message };
  }

  if (existing?.photo_path && existing.photo_path !== path) {
    await supabase.storage
      .from(STORAGE_BUCKETS.avatars)
      .remove([existing.photo_path]);
  }

  revalidatePath(`/admin/candidates/${candidateId}`);
  revalidatePath("/admin/candidates");
  revalidatePath(`/staff/candidates/${candidateId}`);
  revalidatePath("/staff/candidates");
  return { ok: true };
}

export async function uploadAdminAvatar(
  formData: FormData
): Promise<ActionResult> {
  const { user } = await requireRole("admin");
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Choose an image." };
  const err = mimeOk(file);
  if (err) return { error: err };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("admins")
    .select("avatar_path")
    .eq("id", user.id)
    .maybeSingle();

  const ext = extensionFromFileName(file.name) || "jpg";
  const path = buildAvatarPath("admins", user.id, randomUUID(), ext);
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) return { error: uploadError.message };

  const { error: updateError } = await supabase
    .from("admins")
    .update({ avatar_path: path })
    .eq("id", user.id);

  if (updateError) {
    await supabase.storage.from(STORAGE_BUCKETS.avatars).remove([path]);
    return { error: updateError.message };
  }

  if (existing?.avatar_path && existing.avatar_path !== path) {
    await supabase.storage
      .from(STORAGE_BUCKETS.avatars)
      .remove([existing.avatar_path]);
  }

  revalidatePath("/admin/profile");
  revalidatePath("/admin");
  return { ok: true };
}
