import { NextResponse } from "next/server";

import { getAuthedUser } from "@/lib/auth/get-user";
import { isInternalRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

function contentDisposition(
  mode: "inline" | "attachment",
  fileName: string
) {
  const safe =
    fileName.replace(/[^\w.\- ()[\]]+/g, "_").slice(0, 120) || "document";
  const encoded = encodeURIComponent(fileName);
  return `${mode}; filename="${safe}"; filename*=UTF-8''${encoded}`;
}

/**
 * Same-origin document stream so browsers can render PDFs reliably.
 * Signed Supabase URLs often open Chrome's PDF viewer with a blank page
 * when the response is an error JSON (URL still ends in .pdf).
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { user, role } = await getAuthedUser();
  if (!user || !isInternalRole(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const disposition =
    new URL(request.url).searchParams.get("download") === "1"
      ? "attachment"
      : "inline";

  const supabase = await createClient();
  const { data: doc, error } = await supabase
    .from("documents")
    .select("file_name, mime_type, storage_bucket, storage_path")
    .eq("id", id)
    .maybeSingle();

  if (error || !doc) {
    return NextResponse.json(
      { error: error?.message ?? "Document not found." },
      { status: 404 }
    );
  }

  const { data: blob, error: downloadError } = await supabase.storage
    .from(doc.storage_bucket)
    .download(doc.storage_path);

  if (downloadError || !blob) {
    return NextResponse.json(
      { error: downloadError?.message ?? "Could not download file." },
      { status: 502 }
    );
  }

  const bytes = Buffer.from(await blob.arrayBuffer());
  const contentType =
    doc.mime_type || blob.type || "application/octet-stream";

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(bytes.byteLength),
      "Content-Disposition": contentDisposition(disposition, doc.file_name),
      "Cache-Control": "private, max-age=60",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
