import { StaffPageHeader } from "@/components/layout/staff-page";
import { StaffRecordList } from "@/components/layout/staff-record-list";
import { formatDocTypeLabel, formatOwnerTypeLabel } from "@/lib/documents/config";
import { createClient } from "@/lib/supabase/server";

export default async function StaffDocumentsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("id, doc_type, file_name, owner_type, owner_id, created_at")
    .order("created_at", { ascending: false })
    .limit(80);

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load documents: {error.message}
      </div>
    );
  }

  const items = (data ?? []).map((row) => ({
    id: row.id,
    href: `/api/documents/${row.id}`,
    title: row.file_name,
    subtitle: formatDocTypeLabel(row.doc_type),
    meta: `${formatOwnerTypeLabel(row.owner_type)} · ${new Date(
      row.created_at
    ).toLocaleDateString("en-GB")}`,
  }));

  return (
    <div className="space-y-5">
      <StaffPageHeader
        title="Documents"
        description={`${items.length} recent files — open from candidate or case profiles to upload`}
      />
      <StaffRecordList
        items={items}
        emptyTitle="No documents yet"
        emptyDescription="Upload passport scans and case files from a candidate or case detail page."
        emptyActionHref="/staff/candidates"
        emptyActionLabel="Go to candidates"
      />
    </div>
  );
}
