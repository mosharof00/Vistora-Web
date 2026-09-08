import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { PassportsTable } from "@/app/(dashboard)/admin/passports/passports-table";
import { PassportsFlashToast } from "@/app/(dashboard)/admin/passports/passports-flash-toast";
import { ListFilters } from "@/components/layout/list-filters";
import { buttonVariants } from "@/components/ui/button";
import { ilikeOr } from "@/lib/list-filters";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { PASSPORT_LIST_STATUS_OPTIONS } from "@/lib/validations/passport";

export default async function AdminPassportsPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    q?: string;
    status?: string;
    candidate?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("passports")
    .select(
      "id, passport_number, passport_type, issuing_country, expiry_date, is_current, full_name_as_in_passport, surname, given_names, candidate_id, candidates(full_name, candidate_code)"
    )
    .order("created_at", { ascending: false });

  if (params.candidate) {
    query = query.eq("candidate_id", params.candidate);
  }

  if (params.status === "current") {
    query = query.eq("is_current", true);
  } else if (params.status === "not_current") {
    query = query.eq("is_current", false);
  } else if (params.status === "expired") {
    const today = new Date().toISOString().slice(0, 10);
    query = query.lt("expiry_date", today);
  }

  const searchOr = params.q
    ? ilikeOr(
        [
          "passport_number",
          "full_name_as_in_passport",
          "surname",
          "given_names",
          "personal_no",
          "previous_passport_no",
        ],
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
        Could not load passports: {error.message}
      </div>
    );
  }

  const rows = (data ?? []).map((row) => {
    const candidate = row.candidates as {
      full_name: string;
      candidate_code: string;
    } | null;
    return {
      id: row.id,
      passport_number: row.passport_number,
      passport_type: row.passport_type,
      issuing_country: row.issuing_country,
      expiry_date: row.expiry_date,
      is_current: row.is_current,
      full_name_as_in_passport: row.full_name_as_in_passport,
      surname: row.surname,
      given_names: row.given_names,
      candidate_id: row.candidate_id,
      candidate_name: candidate?.full_name ?? null,
      candidate_code: candidate?.candidate_code ?? null,
    };
  });

  const currentCount = rows.filter((r) => r.is_current).length;
  const expiredCount = rows.filter((r) => {
    if (!r.expiry_date) return false;
    return new Date(r.expiry_date) < new Date(new Date().toDateString());
  }).length;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <PassportsFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Passports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} shown · {currentCount} current · {expiredCount} expired
            {params.candidate ? " · filtered by candidate" : ""}
          </p>
        </div>
        <Link
          href={
            params.candidate
              ? `/admin/passports/new?candidate=${params.candidate}`
              : "/admin/passports/new"
          }
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add passport
        </Link>
      </div>

      <Suspense fallback={null}>
        <ListFilters
          searchPlaceholder="Search number, name, personal no…"
          statusOptions={PASSPORT_LIST_STATUS_OPTIONS}
          statusAllLabel="All passports"
        />
      </Suspense>

      <PassportsTable passports={rows} />
    </div>
  );
}
