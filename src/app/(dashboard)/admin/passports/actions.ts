"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/get-user";
import {
  buildCandidateDocPath,
  extensionFromFileName,
  STORAGE_BUCKETS,
} from "@/lib/storage/paths";
import { createClient } from "@/lib/supabase/server";
import {
  passportSchema,
  type PassportInput,
} from "@/lib/validations/passport";

type ActionResult = { error: string };

function emptyToNull(value?: string) {
  const v = value?.trim();
  return v ? v : null;
}

function emptyDate(value?: string) {
  const v = value?.trim();
  return v ? v : null;
}

function toRow(
  values: PassportInput,
  scans: { scan_front_path: string | null; scan_back_path: string | null }
) {
  return {
    candidate_id: values.candidateId,
    passport_number: values.passportNumber.trim().toUpperCase(),
    passport_type: values.passportType.trim(),
    issuing_country: values.issuingCountry.trim().toUpperCase(),
    issue_date: emptyDate(values.issueDate),
    expiry_date: emptyDate(values.expiryDate),
    place_of_issue: emptyToNull(values.placeOfIssue),
    issuing_authority: emptyToNull(values.issuingAuthority),
    surname: emptyToNull(values.surname),
    given_names: emptyToNull(values.givenNames),
    full_name_as_in_passport: emptyToNull(values.fullNameAsInPassport),
    nationality_label: emptyToNull(values.nationalityLabel),
    sex: values.sex || null,
    date_of_birth: emptyDate(values.dateOfBirth),
    place_of_birth: emptyToNull(values.placeOfBirth),
    personal_no: emptyToNull(values.personalNo),
    previous_passport_no: emptyToNull(values.previousPassportNo),
    father_name: emptyToNull(values.fatherName),
    mother_name: emptyToNull(values.motherName),
    legal_guardian_name: emptyToNull(values.legalGuardianName),
    permanent_address: emptyToNull(values.permanentAddress),
    emergency_contact_name: emptyToNull(values.emergencyContactName),
    emergency_contact_relationship: emptyToNull(
      values.emergencyContactRelationship
    ),
    emergency_contact_address: emptyToNull(values.emergencyContactAddress),
    emergency_contact_phone: emptyToNull(values.emergencyContactPhone),
    mrz_line1: emptyToNull(values.mrzLine1),
    mrz_line2: emptyToNull(values.mrzLine2),
    is_current: values.isCurrent,
    notes: emptyToNull(values.notes),
    scan_front_path: scans.scan_front_path,
    scan_back_path: scans.scan_back_path,
  };
}

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

async function uploadScan(
  candidateId: string,
  side: "scan_front" | "scan_back",
  file: File | null
): Promise<{ error: string } | { path: string } | null> {
  if (!file || file.size === 0) return null;
  if (file.size > 15 * 1024 * 1024) {
    return { error: "Scan must be under 15 MB." };
  }

  const supabase = await createClient();
  const fileId = randomUUID();
  const extension = extensionFromFileName(file.name);
  const path = buildCandidateDocPath(candidateId, side, fileId, extension);
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.passports)
    .upload(path, bytes, {
      contentType: mimeForUpload(file),
      upsert: false,
      cacheControl: "3600",
    });

  if (error) return { error: error.message };
  return { path };
}

async function clearOtherCurrent(
  candidateId: string,
  exceptId?: string
) {
  const supabase = await createClient();
  let query = supabase
    .from("passports")
    .update({ is_current: false })
    .eq("candidate_id", candidateId)
    .eq("is_current", true);
  if (exceptId) {
    query = query.neq("id", exceptId);
  }
  await query;
}

function revalidatePassportPaths(
  id: string,
  candidateId: string
) {
  revalidatePath("/admin/passports");
  revalidatePath(`/admin/passports/${id}`);
  revalidatePath(`/admin/passports/${id}/edit`);
  revalidatePath(`/admin/candidates/${candidateId}`);
  revalidatePath("/admin/candidates");
  revalidatePath("/admin");
}

export async function createPassport(
  values: PassportInput,
  formData?: FormData
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = passportSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const data = parsed.data;
  const frontFile = formData?.get("scanFront");
  const backFile = formData?.get("scanBack");

  const frontUpload = await uploadScan(
    data.candidateId,
    "scan_front",
    frontFile instanceof File ? frontFile : null
  );
  if (frontUpload && "error" in frontUpload) return frontUpload;

  const backUpload = await uploadScan(
    data.candidateId,
    "scan_back",
    backFile instanceof File ? backFile : null
  );
  if (backUpload && "error" in backUpload) return backUpload;

  if (data.isCurrent) {
    await clearOtherCurrent(data.candidateId);
  }

  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("passports")
    .insert(
      toRow(data, {
        scan_front_path:
          (frontUpload && "path" in frontUpload ? frontUpload.path : null) ??
          emptyToNull(data.scanFrontPath),
        scan_back_path:
          (backUpload && "path" in backUpload ? backUpload.path : null) ??
          emptyToNull(data.scanBackPath),
      })
    )
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        error:
          "This passport number is already marked current, or another current passport exists for the candidate.",
      };
    }
    return { error: error.message };
  }

  revalidatePassportPaths(row.id, data.candidateId);
  redirect(`/admin/passports/${row.id}?created=1`);
}

export async function updatePassport(
  id: string,
  values: PassportInput,
  formData?: FormData
): Promise<ActionResult | void> {
  await requireRole("admin");
  const parsed = passportSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }

  const data = parsed.data;
  const frontFile = formData?.get("scanFront");
  const backFile = formData?.get("scanBack");

  const frontUpload = await uploadScan(
    data.candidateId,
    "scan_front",
    frontFile instanceof File ? frontFile : null
  );
  if (frontUpload && "error" in frontUpload) return frontUpload;

  const backUpload = await uploadScan(
    data.candidateId,
    "scan_back",
    backFile instanceof File ? backFile : null
  );
  if (backUpload && "error" in backUpload) return backUpload;

  if (data.isCurrent) {
    await clearOtherCurrent(data.candidateId, id);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("passports")
    .update(
      toRow(data, {
        scan_front_path:
          (frontUpload && "path" in frontUpload ? frontUpload.path : null) ??
          emptyToNull(data.scanFrontPath),
        scan_back_path:
          (backUpload && "path" in backUpload ? backUpload.path : null) ??
          emptyToNull(data.scanBackPath),
      })
    )
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        error:
          "This passport number is already marked current, or another current passport exists for the candidate.",
      };
    }
    return { error: error.message };
  }

  revalidatePassportPaths(id, data.candidateId);
  redirect(`/admin/passports/${id}?updated=1`);
}

export async function getPassportScanSignedUrl(
  storagePath: string
): Promise<{ error: string } | { url: string }> {
  await requireRole("admin");
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.passports)
    .createSignedUrl(storagePath, 60 * 10);
  if (error || !data?.signedUrl) {
    return { error: error?.message ?? "Could not create signed URL." };
  }
  return { url: data.signedUrl };
}

export async function setPassportCurrent(
  id: string,
  candidateId: string
): Promise<ActionResult | void> {
  await requireRole("admin");
  await clearOtherCurrent(candidateId, id);
  const supabase = await createClient();
  const { error } = await supabase
    .from("passports")
    .update({ is_current: true })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePassportPaths(id, candidateId);
}
