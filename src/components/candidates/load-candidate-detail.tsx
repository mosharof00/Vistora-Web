import { notFound } from "next/navigation";

import { CandidateDetailView } from "@/components/candidates/candidate-detail";
import type { CandidateAreaPaths } from "@/lib/candidates/paths";
import { resolveUserDisplayNames } from "@/lib/candidates/resolve-user-names";
import { createClient } from "@/lib/supabase/server";

export async function loadCandidateDetailPage({
  id,
  paths,
  flash,
}: {
  id: string;
  paths: CandidateAreaPaths;
  flash: { created?: string; updated?: string };
}) {
  const supabase = await createClient();

  const [
    { data: candidate, error },
    { data: docs },
    { data: cases },
    { data: passports },
  ] = await Promise.all([
    supabase
      .from("candidates")
      .select("*, agents(id, agent_code, full_name, agency_name)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("documents")
      .select("id, doc_type, file_name, created_at, uploaded_by")
      .eq("owner_type", "candidate")
      .eq("owner_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("candidate_cases")
      .select(
        "id, case_code, overall_status, visa_batches(batch_code), job_orders(order_code)"
      )
      .eq("candidate_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("passports")
      .select(
        "id, passport_number, passport_type, expiry_date, is_current, full_name_as_in_passport, surname, given_names, created_by"
      )
      .eq("candidate_id", id)
      .order("is_current", { ascending: false })
      .order("expiry_date", { ascending: false }),
  ]);

  if (error || !candidate) notFound();

  const nameMap = await resolveUserDisplayNames(supabase, [
    candidate.created_by,
    candidate.updated_by,
    ...(docs ?? []).map((d) => d.uploaded_by),
    ...(passports ?? []).map((p) => p.created_by),
  ]);

  return (
    <CandidateDetailView
      paths={paths}
      candidate={candidate}
      docs={(docs ?? []).map((d) => ({
        ...d,
        uploaded_by_name: d.uploaded_by
          ? nameMap.get(d.uploaded_by) ?? null
          : null,
      }))}
      cases={(cases ?? []).map((row) => ({
        id: row.id,
        case_code: row.case_code,
        overall_status: row.overall_status,
        visa_batches: row.visa_batches as { batch_code: string } | null,
        job_orders: row.job_orders as { order_code: string } | null,
      }))}
      passports={(passports ?? []).map((p) => ({
        ...p,
        created_by_name: p.created_by
          ? nameMap.get(p.created_by) ?? null
          : null,
      }))}
      flash={flash}
      createdByName={
        candidate.created_by
          ? nameMap.get(candidate.created_by) ?? null
          : null
      }
      updatedByName={
        candidate.updated_by
          ? nameMap.get(candidate.updated_by) ?? null
          : null
      }
    />
  );
}
