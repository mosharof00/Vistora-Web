import { notFound } from "next/navigation";

import { VisaBatchForm } from "@/app/(dashboard)/admin/visa-batches/visa-batch-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";
import { formatStatusLabel, statusTone } from "@/lib/status";

export default async function EditVisaBatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: batch, error }, { data: orders }] = await Promise.all([
    supabase.from("visa_batches").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("job_orders")
      .select("id, order_code, title")
      .order("created_at", { ascending: false }),
  ]);

  if (error || !batch) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageBackLink
            href={`/admin/visa-batches/${batch.id}`}
            label="Back to batch"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit visa batch
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {batch.batch_code} · {batch.title}
          </p>
        </div>
        <StatusBadge tone={statusTone(batch.status)}>
          {formatStatusLabel(batch.status)}
        </StatusBadge>
      </div>

      <VisaBatchForm
        mode="edit"
        batchId={batch.id}
        orders={(orders ?? []).map((o) => ({
          id: o.id,
          label: `${o.order_code} — ${o.title}`,
        }))}
        defaultValues={{
          batchCode: batch.batch_code,
          title: batch.title,
          jobOrderId: batch.job_order_id,
          visaNumber: batch.visa_number ?? "",
          visaIdNumber: batch.visa_id_number ?? "",
          quotaCount: batch.quota_count,
          proOffice: batch.pro_office ?? "",
          status: batch.status,
          openedAt: batch.opened_at ?? "",
          closedAt: batch.closed_at ?? "",
          notes: batch.notes ?? "",
        }}
      />
    </div>
  );
}
