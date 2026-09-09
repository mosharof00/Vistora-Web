import { PassportForm } from "@/app/(dashboard)/admin/passports/passport-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { createClient } from "@/lib/supabase/server";
import { emptyPassportValues } from "@/lib/validations/passport";

export default async function NewPassportPage({
  searchParams,
}: {
  searchParams: Promise<{ candidate?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: candidates } = await supabase
    .from("candidates")
    .select("id, candidate_code, full_name")
    .order("full_name", { ascending: true });

  const options = (candidates ?? []).map((c) => ({
    id: c.id,
    label: `${c.candidate_code} — ${c.full_name}`,
  }));

  return (
    <div className="space-y-6">
      <div>
        <PageBackLink href="/staff/passports" label="Back to passports" />
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          New passport
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter fields from the passport scan as printed.
        </p>
      </div>

      <PassportForm
        mode="create"
        basePath="/staff/passports"
        candidates={options}
        lockCandidate={Boolean(params.candidate)}
        defaultValues={{
          ...emptyPassportValues,
          candidateId: params.candidate ?? "",
        }}
      />
    </div>
  );
}
