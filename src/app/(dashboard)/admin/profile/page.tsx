import Link from "next/link";
import { notFound } from "next/navigation";
import {
  KeyRound,
  LayoutDashboard,
  Mail,
  Phone,
  Shield,
} from "lucide-react";

import { AdminProfileForm } from "@/app/(dashboard)/admin/profile/admin-profile-form";
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
import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function AdminProfilePage() {
  const { user } = await requireRole("admin");
  const supabase = await createClient();

  const { data: admin, error } = await supabase
    .from("admins")
    .select("id, full_name, email, phone, avatar_path, is_active, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !admin) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your administrator account for Vistora
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone={admin.is_active ? "success" : "neutral"}>
            {admin.is_active ? "Active" : "Inactive"}
          </StatusBadge>
          <StatusBadge tone="primary">Administrator</StatusBadge>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Identity</CardTitle>
          <CardDescription>Photo and contact summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfilePhotoCard
            kind="admins"
            ownerId={admin.id}
            name={admin.full_name}
            hasPhoto={Boolean(admin.avatar_path)}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryTile
              icon={Mail}
              label="Email"
              value={admin.email}
            />
            <SummaryTile
              icon={Phone}
              label="Phone"
              value={admin.phone}
            />
            <SummaryTile
              icon={Shield}
              label="Role"
              value="Administrator"
            />
            <SummaryTile
              icon={LayoutDashboard}
              label="Member since"
              value={new Date(admin.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            />
          </div>
        </CardContent>
      </Card>

      <AdminProfileForm
        email={admin.email}
        defaultValues={{
          fullName: admin.full_name,
          phone: admin.phone ?? "",
        }}
      />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Password and session options
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/forgot-password"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "gap-1.5"
            )}
          >
            <KeyRound className="size-4" />
            Reset password
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Log out
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
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
