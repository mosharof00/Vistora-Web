import Link from "next/link";

import { OpenDocumentButton } from "@/components/documents/document-slots";
import { buttonVariants } from "@/components/ui/button";
import {
  formatDocTypeLabel,
  formatOwnerTypeLabel,
} from "@/lib/documents/config";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

function ownerHref(ownerType: string, ownerId: string) {
  switch (ownerType) {
    case "employer_company":
      return `/admin/companies/${ownerId}`;
    case "case":
      return `/admin/cases/${ownerId}`;
    case "candidate":
      return `/admin/candidates/${ownerId}`;
    case "job_order":
      return `/admin/job-orders/${ownerId}`;
    default:
      return null;
  }
}

export default async function AdminDocumentsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select(
      "id, owner_type, owner_id, doc_type, file_name, mime_type, byte_size, created_at, storage_bucket"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load documents: {error.message}
      </div>
    );
  }

  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Recent uploads across companies, candidates, and cases. Upload from
          each record&apos;s detail page.
        </p>
      </div>

      <div className="rounded-2xl bg-card p-4 text-sm text-muted-foreground shadow-sm ring-1 ring-border/60">
        <p className="font-medium text-foreground">Where to upload</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            <Link href="/admin/companies" className="text-primary hover:underline">
              Companies
            </Link>{" "}
            — demand letter, visa advice
          </li>
          <li>
            <Link
              href="/admin/candidates"
              className="text-primary hover:underline"
            >
              Candidates
            </Link>{" "}
            — passport, NID, photo
          </li>
          <li>
            <Link href="/admin/cases" className="text-primary hover:underline">
              Cases
            </Link>{" "}
            — medical, visa, BMET, tickets
          </li>
        </ul>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
          <Link
            href="/admin/companies"
            className={cn(buttonVariants(), "mt-4")}
          >
            Open companies
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-border/70 bg-secondary/40 text-muted-foreground">
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Uploaded</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const href = ownerHref(row.owner_type, row.owner_id);
                  const sizeKb =
                    row.byte_size != null
                      ? `${Math.max(1, Math.round(Number(row.byte_size) / 1024))} KB`
                      : null;
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="line-clamp-1 font-medium">
                          {row.file_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {row.storage_bucket}
                          {sizeKb ? ` · ${sizeKb}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {formatDocTypeLabel(row.doc_type)}
                      </td>
                      <td className="px-4 py-3">
                        {href ? (
                          <Link
                            href={href}
                            className="text-primary hover:underline"
                          >
                            {formatOwnerTypeLabel(row.owner_type)}
                          </Link>
                        ) : (
                          formatOwnerTypeLabel(row.owner_type)
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(row.created_at).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <OpenDocumentButton documentId={row.id} label="Open" />
                        <OpenDocumentButton
                          documentId={row.id}
                          label="Download"
                          download
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
