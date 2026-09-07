/**
 * Organized storage object paths.
 *
 * Examples:
 *   avatars/candidates/{id}/{uuid}.webp
 *   avatars/employees/{id}/{uuid}.webp
 *   passports/candidates/{id}/{uuid}.pdf
 *   case-docs/cases/{caseId}/medical_report/{uuid}.pdf
 *   finance-proofs/company_payments/{id}/{uuid}.jpg
 *   contracts/employer_companies/{id}/demand_letter/{uuid}.pdf
 *
 * Bucket is chosen separately; path never repeats the bucket name.
 */
export const STORAGE_BUCKETS = {
  avatars: "avatars",
  passports: "passports",
  caseDocs: "case-docs",
  contracts: "contracts",
  financeProofs: "finance-proofs",
  marketing: "marketing",
} as const;

export type StorageBucket =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export type StorageFolder =
  | "candidates"
  | "employees"
  | "admins"
  | "agents"
  | "employer_companies"
  | "cases"
  | "job_orders"
  | "company_payments"
  | "candidate_payments"
  | "marketing";

export function buildStorageObjectPath(input: {
  folder: StorageFolder;
  ownerId: string;
  docType?: string;
  fileId: string;
  extension: string;
}): string {
  const ext = input.extension.replace(/^\./, "").toLowerCase();
  const parts = [input.folder, input.ownerId];
  if (input.docType) parts.push(input.docType);
  parts.push(`${input.fileId}.${ext}`);
  return parts.join("/");
}

/** Avatar under avatars/{roleFolder}/{id}/{file} */
export function buildAvatarPath(
  roleFolder: "candidates" | "employees" | "admins",
  ownerId: string,
  fileId: string,
  extension: string
) {
  return buildStorageObjectPath({
    folder: roleFolder,
    ownerId,
    fileId,
    extension,
  });
}

/** Employer deal docs under contracts/employer_companies/{id}/{docType}/ */
export function buildEmployerDocPath(
  companyId: string,
  docType: "demand_letter" | "visa_advice" | "employer_other",
  fileId: string,
  extension: string
) {
  return buildStorageObjectPath({
    folder: "employer_companies",
    ownerId: companyId,
    docType,
    fileId,
    extension,
  });
}

/** Case processing docs under case-docs/cases/{caseId}/{docType}/ */
export function buildCaseDocPath(
  caseId: string,
  docType: string,
  fileId: string,
  extension: string
) {
  return buildStorageObjectPath({
    folder: "cases",
    ownerId: caseId,
    docType,
    fileId,
    extension,
  });
}

/** Candidate identity docs under passports/candidates/{id}/{docType}/ */
export function buildCandidateDocPath(
  candidateId: string,
  docType: string,
  fileId: string,
  extension: string
) {
  return buildStorageObjectPath({
    folder: "candidates",
    ownerId: candidateId,
    docType,
    fileId,
    extension,
  });
}

export function extensionFromFileName(fileName: string) {
  const parts = fileName.split(".");
  if (parts.length < 2) return "bin";
  return parts.pop()!.toLowerCase().slice(0, 10) || "bin";
}
