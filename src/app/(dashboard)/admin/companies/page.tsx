import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { CompaniesTable } from "@/app/(dashboard)/admin/companies/companies-table";
import { CompaniesFlashToast } from "@/app/(dashboard)/admin/companies/companies-flash-toast";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function AdminCompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: companies, error } = await supabase
    .from("employer_companies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load companies: {error.message}
      </div>
    );
  }

  const rows = companies ?? [];
  const activeCount = rows.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <CompaniesFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Employer Companies
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} total · {activeCount} active — Admin-only create/edit
          </p>
        </div>
        <Link
          href="/admin/companies/new"
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add company
        </Link>
      </div>

      <CompaniesTable companies={rows} />
    </div>
  );
}
