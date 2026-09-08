import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

import { requireRole } from "@/lib/auth/get-user";
import {
  acceptKindForSlot,
  bucketForOwner,
  folderForOwner,
  validateUploadFile,
  type DocAcceptKind,
  type DocumentOwnerType,
  type DocumentType,
  CANDIDATE_DOC_SLOTS,
  CASE_DOC_SLOTS,
  EMPLOYEE_DOC_SLOTS,
  EMPLOYER_DOC_SLOTS,
  PASSPORT_DOC_SLOTS,
} from "@/lib/documents/config";
import {
  buildStorageObjectPath,
  extensionFromFileName,
} from "@/lib/storage/paths";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const OWNER_TYPES = new Set<DocumentOwnerType>([
  "candidate",
  "case",
  "agent",
  "employer_company",
  "employee",
  "job_order",
]);

const ALL_SLOTS = [
  ...EMPLOYER_DOC_SLOTS,
  ...CASE_DOC_SLOTS,
  ...CANDIDATE_DOC_SLOTS,
  ...PASSPORT_DOC_SLOTS,
  ...EMPLOYEE_DOC_SLOTS,
];

function mimeForUpload(file: File) {
  if (file.type && file.type !== "application/octet-stream") {
    return file.type;
  }
  switch (extensionFromFileName(file.name)) {
    case "pdf":
      return "application/pdf";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    default:
      return file.type || "application/octet-stream";
  }
}

function acceptForDocType(docType: string): DocAcceptKind {
  const slot = ALL_SLOTS.find((s) => s.type === docType);
  return slot ? acceptKindForSlot(slot) : "pdf_or_image";
}

/**
 * Multipart upload that bypasses Server Action 1 MB body limits.
 * Replaces any existing file for the same owner + doc type (deletes storage).
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await requireRole("admin");
    const formData = await request.formData();

    const ownerTypeRaw = String(formData.get("ownerType") ?? "");
    const ownerId = String(formData.get("ownerId") ?? "");
    const docType = String(formData.get("docType") ?? "") as DocumentType;
    const replaceExisting =
      String(formData.get("replace") ?? "1") !== "0";
    const file = formData.get("file");

    if (!OWNER_TYPES.has(ownerTypeRaw as DocumentOwnerType)) {
      return NextResponse.json(
        { error: "Invalid document owner." },
        { status: 400 }
      );
    }
    const ownerType = ownerTypeRaw as DocumentOwnerType;

    if (!ownerId || !docType) {
      return NextResponse.json(
        { error: "Missing owner or document type." },
        { status: 400 }
      );
    }
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Choose a file to upload." },
        { status: 400 }
      );
    }

    const accept = acceptForDocType(docType);
    const fileError = validateUploadFile(file, accept);
    if (fileError) {
      return NextResponse.json({ error: fileError }, { status: 400 });
    }

    const bucket = bucketForOwner(ownerType);
    const folder = folderForOwner(ownerType);
    const fileId = randomUUID();
    const extension = extensionFromFileName(file.name);
    const storagePath = buildStorageObjectPath({
      folder,
      ownerId,
      docType,
      fileId,
      extension,
    });

    const supabase = await createClient();
    const contentType = mimeForUpload(file);
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, bytes, {
        contentType,
        upsert: false,
        cacheControl: "3600",
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // Load previous files for this slot before insert (for cleanup after success).
    let previous: {
      id: string;
      storage_bucket: string;
      storage_path: string;
    }[] = [];
    if (replaceExisting) {
      const { data: existing } = await supabase
        .from("documents")
        .select("id, storage_bucket, storage_path")
        .eq("owner_type", ownerType)
        .eq("owner_id", ownerId)
        .eq("doc_type", docType);
      previous = existing ?? [];
    }

    const { data, error: insertError } = await supabase
      .from("documents")
      .insert({
        owner_type: ownerType,
        owner_id: ownerId,
        doc_type: docType,
        file_name: file.name.slice(0, 180),
        storage_bucket: bucket,
        storage_path: storagePath,
        mime_type: contentType,
        byte_size: file.size,
        uploaded_by: user.id,
        is_original: true,
        is_optimized: false,
      })
      .select("id")
      .single();

    if (insertError) {
      await supabase.storage.from(bucket).remove([storagePath]);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    if (previous.length > 0) {
      const byBucket = new Map<string, string[]>();
      for (const row of previous) {
        const list = byBucket.get(row.storage_bucket) ?? [];
        list.push(row.storage_path);
        byBucket.set(row.storage_bucket, list);
      }
      for (const [b, paths] of byBucket) {
        await supabase.storage.from(b).remove(paths);
      }
      await supabase
        .from("documents")
        .delete()
        .in(
          "id",
          previous.map((p) => p.id)
        );
    }

    return NextResponse.json({ ok: true, documentId: data.id });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Upload failed.";
    const status = message.toLowerCase().includes("unauthorized")
      ? 401
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
