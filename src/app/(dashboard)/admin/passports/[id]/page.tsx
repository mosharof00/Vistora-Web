import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Pencil } from "lucide-react";

import { PassportScanPreview } from "@/app/(dashboard)/admin/passports/passport-scan-preview";
import { SetCurrentPassportButton } from "@/app/(dashboard)/admin/passports/set-current-button";
import { DocumentSlotsGrid } from "@/components/documents/document-slots";
import { PageBackLink } from "@/components/layout/page-back-link";
import { ListFlashToast } from "@/components/layout/list-flash-toast";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PASSPORT_DOC_SLOTS } from "@/lib/documents/config";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 break-words text-sm font-medium">
        {value?.trim() ? value : "—"}
      </p>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function PassportDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const { id } = await params;
  const flash = await searchParams;
  const supabase = await createClient();

  const { data: passport, error } = await supabase
    .from("passports")
    .select("*, candidates(id, candidate_code, full_name)")
    .eq("id", id)
    .maybeSingle();

  if (error || !passport) notFound();

  const candidate = passport.candidates as {
    id: string;
    candidate_code: string;
    full_name: string;
  } | null;

  const { data: docs } = candidate
    ? await supabase
        .from("documents")
        .select("id, doc_type, file_name, created_at")
        .eq("owner_type", "candidate")
        .eq("owner_id", candidate.id)
        .in(
          "doc_type",
          PASSPORT_DOC_SLOTS.map((s) => s.type)
        )
        .order("created_at", { ascending: false })
    : { data: [] };

  const expired =
    passport.expiry_date != null &&
    new Date(passport.expiry_date) < new Date(new Date().toDateString());

  const displayName =
    passport.full_name_as_in_passport ||
    [passport.given_names, passport.surname].filter(Boolean).join(" ") ||
    passport.passport_number;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <ListFlashToast
          created={flash.created === "1"}
          updated={flash.updated === "1"}
          createdMessage="Passport created."
          updatedMessage="Passport updated."
          toastId={`passport-${id}`}
        />
      </Suspense>

      <div>
        <PageBackLink href="/admin/passports" label="Back to passports" />
        <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {passport.passport_number}
              </h1>
              {passport.is_current ? (
                <StatusBadge tone="success">Current</StatusBadge>
              ) : (
                <StatusBadge tone="neutral">History</StatusBadge>
              )}
              {expired ? <StatusBadge tone="danger">Expired</StatusBadge> : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {displayName}
              {candidate
                ? ` · ${candidate.candidate_code} — ${candidate.full_name}`
                : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!passport.is_current ? (
              <SetCurrentPassportButton
                passportId={passport.id}
                candidateId={passport.candidate_id}
              />
            ) : null}
            <Link
              href={`/admin/passports/${passport.id}/edit`}
              className={cn(buttonVariants(), "gap-1.5")}
            >
              <Pencil className="size-4" />
              Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>Biodata</CardTitle>
            <CardDescription>Identity page fields</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Type" value={passport.passport_type} />
            <Field label="Country" value={passport.issuing_country} />
            <Field label="Surname" value={passport.surname} />
            <Field label="Given names" value={passport.given_names} />
            <Field
              label="Full name"
              value={passport.full_name_as_in_passport}
            />
            <Field label="Nationality" value={passport.nationality_label} />
            <Field label="Sex" value={passport.sex} />
            <Field
              label="Date of birth"
              value={formatDate(passport.date_of_birth)}
            />
            <Field label="Place of birth" value={passport.place_of_birth} />
            <Field label="Personal No." value={passport.personal_no} />
            <Field
              label="Previous passport No."
              value={passport.previous_passport_no}
            />
            <Field label="Date of issue" value={formatDate(passport.issue_date)} />
            <Field
              label="Date of expiry"
              value={formatDate(passport.expiry_date)}
            />
            <Field
              label="Issuing authority"
              value={passport.issuing_authority}
            />
            <Field label="Place of issue" value={passport.place_of_issue} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Candidate</CardTitle>
            <CardDescription>Linked profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {candidate ? (
              <Link
                href={`/admin/candidates/${candidate.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {candidate.candidate_code} — {candidate.full_name}
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
            <Link
              href={`/admin/passports?candidate=${passport.candidate_id}`}
              className="block text-xs text-muted-foreground hover:underline"
            >
              All passports for this candidate
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Family &amp; emergency</CardTitle>
          <CardDescription>Additional information page</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Father's name" value={passport.father_name} />
          <Field label="Mother's name" value={passport.mother_name} />
          <Field
            label="Legal guardian"
            value={passport.legal_guardian_name}
          />
          <Field
            label="Permanent address"
            value={passport.permanent_address}
          />
          <Field
            label="Emergency contact"
            value={passport.emergency_contact_name}
          />
          <Field
            label="Relationship"
            value={passport.emergency_contact_relationship}
          />
          <Field
            label="Emergency phone"
            value={passport.emergency_contact_phone}
          />
          <Field
            label="Emergency address"
            value={passport.emergency_contact_address}
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Passport documents</CardTitle>
          <CardDescription>
            Upload PDF or image scans — same files appear on the candidate
            profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          {candidate ? (
            <DocumentSlotsGrid
              ownerType="candidate"
              ownerId={candidate.id}
              slots={PASSPORT_DOC_SLOTS}
              documents={docs ?? []}
              columnsClassName="sm:grid-cols-2 lg:grid-cols-3"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Link a candidate to attach documents.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Stored scan paths</CardTitle>
            <CardDescription>
              Optional paths from the passport form upload
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PassportScanPreview
              path={passport.scan_front_path}
              label="Biodata page"
            />
            <PassportScanPreview
              path={passport.scan_back_path}
              label="Observations page"
            />
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>MRZ &amp; notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="MRZ line 1" value={passport.mrz_line1} />
            <Field label="MRZ line 2" value={passport.mrz_line2} />
            <Field label="Notes" value={passport.notes} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
