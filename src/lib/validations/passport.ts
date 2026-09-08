import { z } from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));
const optionalDate = z.union([z.literal(""), z.string().min(1)]);

export const PASSPORT_SEX_OPTIONS = [
  { value: "", label: "Not set" },
  { value: "M", label: "Male (M)" },
  { value: "F", label: "Female (F)" },
  { value: "X", label: "Unspecified (X)" },
] as const;

export const PASSPORT_TYPE_OPTIONS = [
  { value: "P", label: "Ordinary (P)" },
  { value: "ordinary", label: "Ordinary" },
  { value: "official", label: "Official" },
  { value: "diplomatic", label: "Diplomatic" },
] as const;

/** List filter values (URL `status` param). */
export const PASSPORT_LIST_STATUS_OPTIONS = [
  { value: "current", label: "Current" },
  { value: "not_current", label: "Not current" },
  { value: "expired", label: "Expired" },
] as const;

export const passportSchema = z.object({
  candidateId: z.string().uuid("Select a candidate."),
  passportNumber: z
    .string()
    .trim()
    .min(3, "Passport number is required.")
    .max(40, "Keep the number under 40 characters."),
  passportType: z.string().trim().min(1, "Passport type is required."),
  issuingCountry: z
    .string()
    .trim()
    .length(2, "Use a 2-letter country code (e.g. BD)."),
  issueDate: optionalDate,
  expiryDate: optionalDate,
  placeOfIssue: optionalText,
  issuingAuthority: optionalText,
  surname: optionalText,
  givenNames: optionalText,
  fullNameAsInPassport: optionalText,
  nationalityLabel: optionalText,
  sex: z.enum(["", "M", "F", "X"]),
  dateOfBirth: optionalDate,
  placeOfBirth: optionalText,
  personalNo: optionalText,
  previousPassportNo: optionalText,
  fatherName: optionalText,
  motherName: optionalText,
  legalGuardianName: optionalText,
  permanentAddress: optionalText,
  emergencyContactName: optionalText,
  emergencyContactRelationship: optionalText,
  emergencyContactAddress: optionalText,
  emergencyContactPhone: optionalText,
  mrzLine1: optionalText,
  mrzLine2: optionalText,
  isCurrent: z.boolean(),
  notes: optionalText,
  /** Existing storage paths (kept when no new file uploaded). */
  scanFrontPath: optionalText,
  scanBackPath: optionalText,
});

export type PassportInput = z.infer<typeof passportSchema>;

export const emptyPassportValues: PassportInput = {
  candidateId: "",
  passportNumber: "",
  passportType: "P",
  issuingCountry: "BD",
  issueDate: "",
  expiryDate: "",
  placeOfIssue: "",
  issuingAuthority: "",
  surname: "",
  givenNames: "",
  fullNameAsInPassport: "",
  nationalityLabel: "BANGLADESHI",
  sex: "",
  dateOfBirth: "",
  placeOfBirth: "",
  personalNo: "",
  previousPassportNo: "",
  fatherName: "",
  motherName: "",
  legalGuardianName: "",
  permanentAddress: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactAddress: "",
  emergencyContactPhone: "",
  mrzLine1: "",
  mrzLine2: "",
  isCurrent: true,
  notes: "",
  scanFrontPath: "",
  scanBackPath: "",
};
