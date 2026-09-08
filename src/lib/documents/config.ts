import type { Database } from "@/types/database.types";
import { STORAGE_BUCKETS, type StorageBucket } from "@/lib/storage/paths";

export type DocumentOwnerType =
  Database["public"]["Enums"]["document_owner_type"];
export type DocumentType = Database["public"]["Enums"]["document_type"];

/** What the slot accepts in the file picker / validation. */
export type DocAcceptKind = "image" | "pdf_or_image";

export type DocSlot = {
  type: DocumentType;
  label: string;
  hint: string;
  /** Default `pdf_or_image`. Photo slots use `image`. */
  accept?: DocAcceptKind;
};

export const EMPLOYER_DOC_SLOTS: DocSlot[] = [
  {
    type: "demand_letter",
    label: "Demand letter",
    hint: "Official demand / requisition from the employer",
  },
  {
    type: "visa_advice",
    label: "Visa advice",
    hint: "Visa advice / authorization document",
  },
  {
    type: "employer_other",
    label: "Other company docs",
    hint: "Contracts, letters, misc. employer files",
  },
];

export const CASE_DOC_SLOTS: DocSlot[] = [
  {
    type: "medical_report",
    label: "Medical report",
    hint: "Medical exam result",
  },
  {
    type: "fit_card",
    label: "Fit card",
    hint: "Medical fitness card",
  },
  {
    type: "police_clearance",
    label: "Police clearance",
    hint: "Police clearance certificate",
  },
  {
    type: "visa",
    label: "Visa",
    hint: "Work visa / e-visa copy",
  },
  {
    type: "contract",
    label: "Contract",
    hint: "Employment / offer contract",
  },
  {
    type: "bmet_card",
    label: "BMET card",
    hint: "BMET clearance card",
  },
  {
    type: "ticket",
    label: "Ticket",
    hint: "Flight ticket (generic)",
  },
  {
    type: "ticket_go",
    label: "Go ticket",
    hint: "Outbound ticket",
  },
  {
    type: "ticket_return",
    label: "Return ticket",
    hint: "Return ticket",
  },
  {
    type: "other",
    label: "Other",
    hint: "Misc. case file",
  },
];

export const CANDIDATE_DOC_SLOTS: DocSlot[] = [
  {
    type: "passport_scan",
    label: "Passport scan",
    hint: "Passport bio page / full scan (PDF or image)",
    accept: "pdf_or_image",
  },
  {
    type: "nid",
    label: "NID",
    hint: "National ID card (PDF or image)",
    accept: "pdf_or_image",
  },
  {
    type: "photo",
    label: "Photo",
    hint: "Passport-size photo — images only",
    accept: "image",
  },
  {
    type: "other",
    label: "Other",
    hint: "Misc. candidate file (PDF or image)",
    accept: "pdf_or_image",
  },
];

/** Slots shown on passport detail — files still owned by the candidate. */
export const PASSPORT_DOC_SLOTS: DocSlot[] = [
  {
    type: "passport_scan",
    label: "Passport scan",
    hint: "Full booklet PDF or biodata page",
    accept: "pdf_or_image",
  },
  {
    type: "photo",
    label: "Photo",
    hint: "Passport photo — images only",
    accept: "image",
  },
  {
    type: "other",
    label: "Other",
    hint: "Extra passport-related file (PDF or image)",
    accept: "pdf_or_image",
  },
];

export const EMPLOYEE_DOC_SLOTS: DocSlot[] = [
  {
    type: "nid",
    label: "NID",
    hint: "National ID / staff ID scan",
    accept: "pdf_or_image",
  },
  {
    type: "contract",
    label: "Contract",
    hint: "Employment agreement",
    accept: "pdf_or_image",
  },
  {
    type: "photo",
    label: "Photo copy",
    hint: "Extra photo — images only",
    accept: "image",
  },
  {
    type: "other",
    label: "Other",
    hint: "Misc. employee file",
    accept: "pdf_or_image",
  },
];

const IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const PDF_MIME = new Set(["application/pdf"]);
const IMAGE_EXT = new Set(["jpg", "jpeg", "png", "webp"]);
const PDF_EXT = new Set(["pdf"]);

const MAX_BYTES = 15 * 1024 * 1024;

export function acceptKindForSlot(slot: DocSlot): DocAcceptKind {
  return slot.accept ?? "pdf_or_image";
}

export function acceptAttrForKind(kind: DocAcceptKind) {
  if (kind === "image") {
    return "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
  }
  return "application/pdf,.pdf,image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";
}

export function acceptLabelForKind(kind: DocAcceptKind) {
  return kind === "image" ? "JPG, PNG, or WebP" : "PDF, JPG, PNG, or WebP";
}

function fileExt(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function validateUploadFile(
  file: File,
  accept: DocAcceptKind = "pdf_or_image"
): string | null {
  if (!file || file.size === 0) return "Choose a file to upload.";
  if (file.size > MAX_BYTES) return "File must be 15 MB or smaller.";

  const mime = file.type || "";
  const ext = fileExt(file.name);
  const isImage =
    IMAGE_MIME.has(mime) ||
    ((mime === "application/octet-stream" || !mime) && IMAGE_EXT.has(ext));
  const isPdf =
    PDF_MIME.has(mime) ||
    ((mime === "application/octet-stream" || !mime) && PDF_EXT.has(ext));

  if (accept === "image") {
    if (!isImage) {
      return "This field accepts images only (JPG, PNG, or WebP).";
    }
    return null;
  }

  if (!isImage && !isPdf) {
    return "Use PDF, JPG, PNG, or WebP.";
  }
  return null;
}

export function bucketForOwner(ownerType: DocumentOwnerType): StorageBucket {
  switch (ownerType) {
    case "employer_company":
    case "job_order":
      return STORAGE_BUCKETS.contracts;
    case "candidate":
      return STORAGE_BUCKETS.passports;
    case "case":
      return STORAGE_BUCKETS.caseDocs;
    case "agent":
    case "employee":
      return STORAGE_BUCKETS.caseDocs;
    default:
      return STORAGE_BUCKETS.caseDocs;
  }
}

export function folderForOwner(
  ownerType: DocumentOwnerType
):
  | "employer_companies"
  | "candidates"
  | "cases"
  | "job_orders"
  | "agents"
  | "employees" {
  switch (ownerType) {
    case "employer_company":
      return "employer_companies";
    case "candidate":
      return "candidates";
    case "case":
      return "cases";
    case "job_order":
      return "job_orders";
    case "agent":
      return "agents";
    case "employee":
      return "employees";
    default:
      return "cases";
  }
}

export function formatDocTypeLabel(docType: string) {
  return (
    [
      ...EMPLOYER_DOC_SLOTS,
      ...CASE_DOC_SLOTS,
      ...CANDIDATE_DOC_SLOTS,
      ...PASSPORT_DOC_SLOTS,
      ...EMPLOYEE_DOC_SLOTS,
    ].find((s) => s.type === docType)?.label ?? docType.replaceAll("_", " ")
  );
}

export function formatOwnerTypeLabel(ownerType: string) {
  switch (ownerType) {
    case "employer_company":
      return "Company";
    case "job_order":
      return "Job order";
    case "candidate":
      return "Candidate";
    case "case":
      return "Case";
    case "agent":
      return "Agent";
    case "employee":
      return "Employee";
    default:
      return ownerType;
  }
}
