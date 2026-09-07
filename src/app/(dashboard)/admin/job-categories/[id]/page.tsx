import { notFound } from "next/navigation";

import { JobCategoryForm } from "@/app/(dashboard)/admin/job-categories/job-category-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";

export default async function EditJobCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: category, error } = await supabase
    .from("job_categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !category) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageBackLink
            href="/admin/job-categories"
            label="Back to job categories"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit job category
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{category.name}</p>
        </div>
        <StatusBadge tone={category.is_active ? "success" : "neutral"}>
          {category.is_active ? "Active" : "Inactive"}
        </StatusBadge>
      </div>

      <JobCategoryForm
        mode="edit"
        categoryId={category.id}
        defaultValues={{
          name: category.name,
          slug: category.slug,
          description: category.description ?? "",
          isActive: category.is_active,
        }}
      />
    </div>
  );
}
