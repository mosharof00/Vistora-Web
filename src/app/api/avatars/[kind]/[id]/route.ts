import { NextResponse } from "next/server";

import { getAuthedUser } from "@/lib/auth/get-user";
import { isInternalRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS } from "@/lib/storage/paths";

type Kind = "employees" | "candidates" | "admins";

/**
 * Stream a private avatar for internal users (and the owner).
 * Paths live in the private `avatars` bucket.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ kind: string; id: string }> }
) {
  const { user, role } = await getAuthedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { kind, id } = await context.params;
  if (!["employees", "candidates", "admins"].includes(kind)) {
    return NextResponse.json({ error: "Invalid kind." }, { status: 400 });
  }

  const canView =
    isInternalRole(role) ||
    user.id === id ||
    (kind === "candidates" && role === "candidate");

  if (!canView) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  let path: string | null = null;

  if (kind === "employees") {
    const { data } = await supabase
      .from("employees")
      .select("avatar_path")
      .eq("id", id)
      .maybeSingle();
    path = data?.avatar_path ?? null;
  } else if (kind === "admins") {
    const { data } = await supabase
      .from("admins")
      .select("avatar_path")
      .eq("id", id)
      .maybeSingle();
    path = data?.avatar_path ?? null;
  } else {
    const { data } = await supabase
      .from("candidates")
      .select("photo_path, auth_user_id")
      .eq("id", id)
      .maybeSingle();
    if (
      role === "candidate" &&
      data?.auth_user_id &&
      data.auth_user_id !== user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    path = data?.photo_path ?? null;
  }

  if (!path) {
    return NextResponse.json({ error: "No avatar." }, { status: 404 });
  }

  const { data: blob, error } = await supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .download(path);

  if (error || !blob) {
    return NextResponse.json(
      { error: error?.message ?? "Could not load avatar." },
      { status: 502 }
    );
  }

  const bytes = Buffer.from(await blob.arrayBuffer());
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": blob.type || "image/jpeg",
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "private, max-age=120",
    },
  });
}

export type { Kind };
