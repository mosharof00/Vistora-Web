"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/get-user";
import {
  bucketForOwner,
  folderForOwner,
  validateUploadFile,
  type DocumentOwnerType,
  type DocumentType,
} from "@/lib/documents/config";
import {
  buildStorageObjectPath,
  extensionFromFileName,
} from "@/lib/storage/paths";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { error: string } | { ok: true; documentId: string };
type UrlResult = { error: string } | { url: string };

const OWNER_TYPES = new Set<DocumentOwnerType>([
  "candidate",
  "case",
  "agent",
  "employer_company",
  "employee",
  "job_order",
]);

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
function revalidateOwner(ownerType: DocumentOwnerType, ownerId: string) {
  revalidatePath("/admin/documents");
  revalidatePath("/staff/documents");
  switch (ownerType) {
    case "employer_company":
      revalidatePath(`/admin/companies/${ownerId}`);
      revalidatePath("/admin/companies");
      break;
    case "case":
      revalidatePath(`/admin/cases/${ownerId}`);
      revalidatePath("/admin/cases");
      revalidatePath(`/staff/cases/${ownerId}`);
      revalidatePath("/staff/cases");
      break;
    case "candidate":
      revalidatePath(`/admin/candidates/${ownerId}`);
      revalidatePath("/admin/candidates");
      revalidatePath(`/staff/candidates/${ownerId}`);
      revalidatePath("/staff/candidates");
      revalidatePath("/admin/passports");
      revalidatePath("/staff/passports");
      break;
    case "job_order":
      revalidatePath(`/admin/job-orders/${ownerId}`);
      revalidatePath(`/staff/job-orders/${ownerId}`);
      break;
    default:
      break;
  }
}

export async function uploadDocument(
  formData: FormData
): Promise<ActionResult> {
  const { user } = await requireRole("admin");

  const ownerTypeRaw = String(formData.get("ownerType") ?? "");
  const ownerId = String(formData.get("ownerId") ?? "");
  const docType = String(formData.get("docType") ?? "") as DocumentType;
  const file = formData.get("file");

  if (!OWNER_TYPES.has(ownerTypeRaw as DocumentOwnerType)) {
    return { error: "Invalid document owner." };
  }
  const ownerType = ownerTypeRaw as DocumentOwnerType;

  if (!ownerId || !docType) {
    return { error: "Missing owner or document type." };
  }
  if (!(file instanceof File)) {
    return { error: "Choose a file to upload." };
  }

  const fileError = validateUploadFile(file, "pdf_or_image");
  if (fileError) return { error: fileError };

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

  const { data: previous } = await supabase
    .from("documents")
    .select("id, storage_bucket, storage_path")
    .eq("owner_type", ownerType)
    .eq("owner_id", ownerId)
    .eq("doc_type", docType);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, bytes, {
      contentType,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) {
    return { error: uploadError.message };
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
    return { error: insertError.message };
  }

  if (previous?.length) {
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

  revalidateOwner(ownerType, ownerId);
  return { ok: true, documentId: data.id };
}

export async function getDocumentSignedUrl(
  documentId: string,
  options?: { download?: boolean }
): Promise<UrlResult> {
  await requireRole("admin");
  const supabase = await createClient();

  const { data: doc, error } = await supabase
    .from("documents")
    .select("id, file_name")
    .eq("id", documentId)
    .maybeSingle();

  if (error || !doc) {
    return { error: error?.message ?? "Document not found." };
  }

  // Prefer same-origin stream (reliable PDF inline view in Chrome).
  const qs = options?.download ? "?download=1" : "";
  return { url: `/api/documents/${doc.id}${qs}` };
}
