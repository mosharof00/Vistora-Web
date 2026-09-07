import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Briefcase,
  CalendarDays,
  IdCard,
  Mail,
  Pencil,
  Phone,
  Wallet,
} from "lucide-react";

import { ResendInviteButton } from "@/app/(dashboard)/admin/employees/resend-invite-button";
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
import { createClient } from "@/lib/supabase/server";
import { EMPLOYEE_DOC_SLOTS } from "@/lib/documents/config";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

export default async function EmployeeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const { id } = await params;
  const flash = await searchParams;
  const supabase = await createClient();

  const [{ data: employee, error }, { count: assignedCases }, { data: docs }] =
    await Promise.all([
      supabase.from("employees").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("candidate_cases")
        .select("id", { count: "exact", head: true })
        .eq("assigned_staff_id", id),
      supabase
        .from("documents")
        .select("id, doc_type, file_name, created_at")
        .eq("owner_type", "employee")
        .eq("owner_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (error || !employee) notFound();

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <ListFlashToast
          created={flash.created === "1"}
          updated={flash.updated === "1"}
          createdMessage="Employee invited. They’ll get an email to set a password."
          updatedMessage="Employee updated."
          toastId={`employee-${id}`}
        />
      </Suspense>

      <div>
        <PageBackLink href="/admin/employees" label="Back to employees" />
        <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {employee.full_name}
              </h1>
              <StatusBadge tone={statusTone(employee.status)}>
                {formatStatusLabel(employee.status)}
              </StatusBadge>
              <StatusBadge tone="info">
                {formatStatusLabel(employee.role)}
              </StatusBadge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {employee.employee_code}
              {employee.designation ? ` · ${employee.designation}` : ""}
              {employee.department ? ` · ${employee.department}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ResendInviteButton employeeId={employee.id} />
            <Link
              href={`/admin/employees/${employee.id}/edit`}
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
          <p className="text-sm text-muted-foreground">Assigned cases</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {assignedCases ?? 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">As case staff</p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Basic salary</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            ৳{Number(employee.basic_salary_bdt).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">BDT / month</p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Joined</p>
          <p className="mt-2 text-lg font-semibold">
            {employee.joining_date
              ? new Date(employee.joining_date).toLocaleDateString("en-GB")
              : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Joining date</p>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">Login email</p>
          <p className="mt-2 truncate text-lg font-semibold">{employee.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">Auth account</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="shadow-sm xl:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              HR record linked to a login role ({formatStatusLabel(employee.role)})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProfilePhotoCard
              kind="employees"
              ownerId={employee.id}
              name={employee.full_name}
              hasPhoto={Boolean(employee.avatar_path)}
            />

            <div className="grid gap-2">
              <ProfileTile icon={Mail} label="Email" value={employee.email} />
              <ProfileTile icon={Phone} label="Phone" value={employee.phone} />
              <ProfileTile icon={IdCard} label="NID" value={employee.nid} />
              <ProfileTile
                icon={Briefcase}
                label="Department"
                value={employee.department}
              />
              <ProfileTile
                icon={Briefcase}
                label="Designation"
                value={employee.designation}
              />
              <ProfileTile
                icon={CalendarDays}
                label="Joining date"
                value={
                  employee.joining_date
                    ? new Date(employee.joining_date).toLocaleDateString("en-GB")
                    : null
                }
              />
              <ProfileTile
                icon={Wallet}
                label="Basic salary"
                value={`৳${Number(employee.basic_salary_bdt).toLocaleString()}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>Employee documents</CardTitle>
            <CardDescription>
              NID, contract, and other HR files — drag &amp; drop or browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentSlotsGrid
              ownerType="employee"
              ownerId={employee.id}
              slots={EMPLOYEE_DOC_SLOTS}
              documents={docs ?? []}
              columnsClassName="sm:grid-cols-2"
            />
          </CardContent>
        </Card>
      </div>
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
