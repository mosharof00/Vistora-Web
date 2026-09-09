import Link from "next/link";
import { Suspense } from "react";
import {
  Briefcase,
  CalendarDays,
  IdCard,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
} from "lucide-react";

import { DocumentSlotsGrid } from "@/components/documents/document-slots";
import { PageBackLink } from "@/components/layout/page-back-link";
import { ListFlashToast } from "@/components/layout/list-flash-toast";
import { ProfilePhotoCard } from "@/components/ui/profile-photo-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CandidateAreaPaths } from "@/lib/candidates/paths";
import { CANDIDATE_DOC_SLOTS } from "@/lib/documents/config";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type CandidateRow = Database["public"]["Tables"]["candidates"]["Row"] & {
  agents: {
    id: string;
    agent_code: string;
    full_name: string;
    agency_name: string | null;
  } | null;
};

type CaseRow = {
  id: string;
  case_code: string;
  overall_status: string;
  visa_batches: { batch_code: string } | null;
  job_orders: { order_code: string } | null;
};

type PassportRow = {
  id: string;
  passport_number: string;
  passport_type: string;
  expiry_date: string | null;
  is_current: boolean;
  full_name_as_in_passport: string | null;
  surname: string | null;
  given_names: string | null;
  created_by_name?: string | null;
};

type DocRow = {
  id: string;
  doc_type: string;
  file_name: string;
  created_at: string;
  uploaded_by_name?: string | null;
};

export function CandidateDetailView({
  paths,
  candidate,
  docs,
  cases,
  passports,
  flash,
  createdByName,
  updatedByName,
}: {
  paths: CandidateAreaPaths;
  candidate: CandidateRow;
  docs: DocRow[];
  cases: CaseRow[];
  passports: PassportRow[];
  flash: { created?: string; updated?: string };
  createdByName?: string | null;
  updatedByName?: string | null;
}) {
  const agent = candidate.agents;
  const currentPassport = passports.find((p) => p.is_current) ?? null;
  const newCaseHref = `${paths.cases}/new?candidate=${candidate.id}`;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <ListFlashToast
          created={flash.created === "1"}
          updated={flash.updated === "1"}
          createdMessage="Candidate created."
          updatedMessage="Candidate updated."
          toastId={`candidate-${candidate.id}`}
        />
      </Suspense>

      <div>
        <PageBackLink href={paths.candidates} label="Back to candidates" />
        <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {candidate.full_name}
              </h1>
              <StatusBadge tone={statusTone(candidate.status)}>
                {formatStatusLabel(candidate.status)}
              </StatusBadge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {candidate.candidate_code}
              {candidate.auth_user_id ? " · Has login" : " · No login yet"}
              {" · "}
              {formatStatusLabel(candidate.source)}
            </p>
            {(createdByName || updatedByName) && (
              <p className="mt-1 text-xs text-muted-foreground">
                {[
                  createdByName ? `Created by ${createdByName}` : null,
                  updatedByName ? `Updated by ${updatedByName}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={newCaseHref}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "gap-1.5"
              )}
            >
              <Plus className="size-4" />
              New case
            </Link>
            <Link
              href={`${paths.candidates}/${candidate.id}/edit`}
              className={cn(buttonVariants(), "gap-1.5")}
            >
              <Pencil className="size-4" />
              Edit profile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Cases</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {cases.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Linked placements</p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Nationality</p>
          <p className="mt-2 text-2xl font-semibold">
            {candidate.nationality || "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {candidate.gender
              ? formatStatusLabel(candidate.gender)
              : "Gender unset"}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Passport</p>
          <p className="mt-2 truncate text-lg font-semibold">
            {currentPassport?.passport_number || "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {currentPassport?.expiry_date
              ? `Exp ${new Date(currentPassport.expiry_date).toLocaleDateString("en-GB")}`
              : passports.length
                ? `${passports.length} booklet(s), none current`
                : "No passport rows"}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Documents</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {docs.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Identity files</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="shadow-sm xl:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Contact and identity fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProfilePhotoCard
              kind="candidates"
              ownerId={candidate.id}
              name={candidate.full_name}
              hasPhoto={Boolean(candidate.photo_path)}
            />

            <ProfileTile icon={Phone} label="Phone" value={candidate.phone} />
            <ProfileTile icon={Mail} label="Email" value={candidate.email} />
            <ProfileTile
              icon={IdCard}
              label="NID"
              value={candidate.nid_number}
            />
            <ProfileTile
              icon={CalendarDays}
              label="Date of birth"
              value={
                candidate.date_of_birth
                  ? new Date(candidate.date_of_birth).toLocaleDateString(
                      "en-GB"
                    )
                  : null
              }
            />
            <ProfileTile
              icon={MapPin}
              label="Present address"
              value={candidate.present_address}
            />

            {(candidate.father_name || candidate.mother_name) && (
              <div className="rounded-2xl bg-secondary/40 px-4 py-3 text-sm">
                {candidate.father_name ? (
                  <p>
                    <span className="text-muted-foreground">Father · </span>
                    {candidate.father_name}
                  </p>
                ) : null}
                {candidate.mother_name ? (
                  <p className="mt-1">
                    <span className="text-muted-foreground">Mother · </span>
                    {candidate.mother_name}
                  </p>
                ) : null}
              </div>
            )}

            {agent ? (
              paths.agents ? (
                <Link
                  href={`${paths.agents}/${agent.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-secondary/40 px-4 py-3 ring-1 ring-border/40 transition-colors hover:bg-secondary/70"
                >
                  <Briefcase className="size-4 text-primary" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Primary agent
                    </p>
                    <p className="truncate text-sm font-medium">
                      {agent.agency_name || agent.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {agent.agent_code}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl bg-secondary/40 px-4 py-3 ring-1 ring-border/40">
                  <Briefcase className="size-4 text-primary" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Primary agent
                    </p>
                    <p className="truncate text-sm font-medium">
                      {agent.agency_name || agent.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {agent.agent_code}
                    </p>
                  </div>
                </div>
              )
            ) : null}

            {(candidate.emergency_contact_name ||
              candidate.emergency_contact_phone) && (
              <div className="rounded-2xl border border-dashed border-border/80 px-4 py-3.5 text-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Emergency contact
                </p>
                <p className="mt-1 font-medium">
                  {candidate.emergency_contact_name || "—"}
                </p>
                <p className="text-muted-foreground">
                  {candidate.emergency_contact_phone || ""}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>Identity documents</CardTitle>
            <CardDescription>
              Passport scan, NID, and photo — drag &amp; drop or browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentSlotsGrid
              ownerType="candidate"
              ownerId={candidate.id}
              slots={CANDIDATE_DOC_SLOTS}
              documents={docs}
              columnsClassName="sm:grid-cols-2"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle>Passports</CardTitle>
            <CardDescription>
              Booklet biodata snapshots — structured fields for processing and
              future resume generation
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`${paths.passports}?candidate=${candidate.id}`}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              View all
            </Link>
            <Link
              href={`${paths.passports}/new?candidate=${candidate.id}`}
              className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
            >
              <Plus className="size-3.5" />
              Add
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!passports.length ? (
            <div className="rounded-xl bg-secondary/40 px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No passport records yet.
              </p>
              <Link
                href={`${paths.passports}/new?candidate=${candidate.id}`}
                className={cn(buttonVariants({ size: "sm" }), "mt-3")}
              >
                Add passport
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {passports.map((row) => {
                const name =
                  row.full_name_as_in_passport ||
                  [row.given_names, row.surname].filter(Boolean).join(" ");
                return (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`${paths.passports}/${row.id}`}
                        className="font-medium tabular-nums text-primary hover:underline"
                      >
                        {row.passport_number}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[
                          name || null,
                          row.expiry_date
                            ? `Exp ${new Date(row.expiry_date).toLocaleDateString("en-GB")}`
                            : null,
                          row.created_by_name
                            ? `Added by ${row.created_by_name}`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    {row.is_current ? (
                      <StatusBadge tone="success">Current</StatusBadge>
                    ) : (
                      <StatusBadge tone="neutral">History</StatusBadge>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle>Cases</CardTitle>
            <CardDescription>
              Placements for this candidate across visa batches
            </CardDescription>
          </div>
          <StatusBadge tone="info">{cases.length}</StatusBadge>
        </CardHeader>
        <CardContent>
          {!cases.length ? (
            <div className="rounded-xl bg-secondary/40 px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No cases yet for this candidate.
              </p>
              <Link
                href={newCaseHref}
                className={cn(buttonVariants({ size: "sm" }), "mt-3")}
              >
                Create case
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {cases.map((row) => {
                const batch = row.visa_batches;
                const order = row.job_orders;
                return (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`${paths.cases}/${row.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {row.case_code}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[batch?.batch_code, order?.order_code]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <StatusBadge tone={statusTone(row.overall_status)}>
                      {formatStatusLabel(row.overall_status)}
                    </StatusBadge>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-secondary/45 px-3.5 py-3 ring-1 ring-border/40">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-medium">
          {value?.trim() ? value : "—"}
        </p>
      </div>
    </div>
  );
}
