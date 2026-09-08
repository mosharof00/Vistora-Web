import { notFound } from "next/navigation";

import { PassportForm } from "@/app/(dashboard)/admin/passports/passport-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";
import type { PassportInput } from "@/lib/validations/passport";

export default async function EditPassportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: passport, error }, { data: candidates }] = await Promise.all([
    supabase.from("passports").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("candidates")
      .select("id, candidate_code, full_name")
      .order("full_name", { ascending: true }),
  ]);

  if (error || !passport) notFound();

  const options = (candidates ?? []).map((c) => ({
    id: c.id,
    label: `${c.candidate_code} — ${c.full_name}`,
  }));

  const defaults: PassportInput = {
    candidateId: passport.candidate_id,
    passportNumber: passport.passport_number,
    passportType: passport.passport_type,
    issuingCountry: passport.issuing_country,
    issueDate: passport.issue_date ?? "",
    expiryDate: passport.expiry_date ?? "",
    placeOfIssue: passport.place_of_issue ?? "",
    issuingAuthority: passport.issuing_authority ?? "",
    surname: passport.surname ?? "",
    givenNames: passport.given_names ?? "",
    fullNameAsInPassport: passport.full_name_as_in_passport ?? "",
    nationalityLabel: passport.nationality_label ?? "",
    sex:
      passport.sex === "M" || passport.sex === "F" || passport.sex === "X"
        ? passport.sex
        : "",
    dateOfBirth: passport.date_of_birth ?? "",
    placeOfBirth: passport.place_of_birth ?? "",
    personalNo: passport.personal_no ?? "",
    previousPassportNo: passport.previous_passport_no ?? "",
    fatherName: passport.father_name ?? "",
    motherName: passport.mother_name ?? "",
    legalGuardianName: passport.legal_guardian_name ?? "",
    permanentAddress: passport.permanent_address ?? "",
    emergencyContactName: passport.emergency_contact_name ?? "",
    emergencyContactRelationship:
      passport.emergency_contact_relationship ?? "",
    emergencyContactAddress: passport.emergency_contact_address ?? "",
    emergencyContactPhone: passport.emergency_contact_phone ?? "",
    mrzLine1: passport.mrz_line1 ?? "",
    mrzLine2: passport.mrz_line2 ?? "",
    isCurrent: passport.is_current,
    notes: passport.notes ?? "",
    scanFrontPath: passport.scan_front_path ?? "",
    scanBackPath: passport.scan_back_path ?? "",
  };

  return (
    <div className="space-y-6">
      <div>
        <PageBackLink
          href={`/admin/passports/${passport.id}`}
          label="Back to passport"
        />
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit {passport.passport_number}
          </h1>
          {passport.is_current ? (
            <StatusBadge tone="success">Current</StatusBadge>
          ) : (
            <StatusBadge tone="neutral">History</StatusBadge>
          )}
        </div>
      </div>

      <PassportForm
        mode="edit"
        passportId={passport.id}
        candidates={options}
        lockCandidate
        defaultValues={defaults}
      />
    </div>
  );
}
