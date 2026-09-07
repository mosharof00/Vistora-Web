import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { JobCategoriesTable } from "@/app/(dashboard)/admin/job-categories/job-categories-table";
import { JobCategoriesFlashToast } from "@/app/(dashboard)/admin/job-categories/job-categories-flash-toast";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function AdminJobCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_categories")
    .select("id, name, slug, description, is_active")
    .order("name", { ascending: true });

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load job categories: {error.message}
      </div>
    );
  }

  const rows = data ?? [];
  const activeCount = rows.filter((r) => r.is_active).length;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <JobCategoriesFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Job Categories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} total · {activeCount} active
          </p>
        </div>
        <Link
          href="/admin/job-categories/new"
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add category
        </Link>
      </div>

      <JobCategoriesTable categories={rows} />
    </div>
  );
}
