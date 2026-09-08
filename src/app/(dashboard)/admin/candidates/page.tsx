import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { CandidatesTable } from "@/app/(dashboard)/admin/candidates/candidates-table";
import { CandidatesFlashToast } from "@/app/(dashboard)/admin/candidates/candidates-flash-toast";
import { ListFilters } from "@/components/layout/list-filters";
import { buttonVariants } from "@/components/ui/button";
import { ilikeOr } from "@/lib/list-filters";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { CANDIDATE_STATUS_OPTIONS } from "@/lib/validations/candidate";

export default async function AdminCandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    agent?: string;
    q?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("candidates")
    .select(
      "id, candidate_code, full_name, phone, email, status, source, primary_agent_id, auth_user_id, photo_path, agents(full_name)"
    )
    .order("created_at", { ascending: false });

  if (params.agent) {
    query = query.eq("primary_agent_id", params.agent);
  }
  if (params.status) {
    query = query.eq("status", params.status);
  }
  const searchOr = params.q
    ? ilikeOr(
        ["full_name", "candidate_code", "phone", "email"],
        params.q
      )
    : null;
  if (searchOr) {
    query = query.or(searchOr);
  }

  const { data, error } = await query;

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load candidates: {error.message}
      </div>
    );
  }

  const rows = (data ?? []).map((row) => {
    const agent = row.agents as { full_name: string } | null;
    return {
      id: row.id,
      candidate_code: row.candidate_code,
      full_name: row.full_name,
      phone: row.phone,
      email: row.email,
      status: row.status,
      source: row.source,
      primary_agent_id: row.primary_agent_id,
      agent_name: agent?.full_name ?? null,
      auth_user_id: row.auth_user_id,
      has_photo: Boolean(row.photo_path),
    };
  });

  const activeLike = rows.filter((c) =>
    ["lead", "registered", "in_process"].includes(c.status)
  ).length;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <CandidatesFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Candidates</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} shown · {activeLike} in pipeline
            {params.agent ? " · filtered by agent" : ""}
          </p>
        </div>
        <Link
          href="/admin/candidates/new"
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add candidate
        </Link>
      </div>

      <Suspense fallback={null}>
        <ListFilters
          searchPlaceholder="Search name, code, phone, email…"
          statusOptions={CANDIDATE_STATUS_OPTIONS}
        />
      </Suspense>

      <CandidatesTable candidates={rows} />
    </div>
  );
}
