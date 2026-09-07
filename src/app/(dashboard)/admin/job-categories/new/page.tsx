import { JobCategoryForm } from "@/app/(dashboard)/admin/job-categories/job-category-form";
import { PageBackLink } from "@/components/layout/page-back-link";

export default function NewJobCategoryPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <PageBackLink
          href="/admin/job-categories"
          label="Back to job categories"
        />
        <h1 className="text-2xl font-semibold tracking-tight">
          Add job category
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Used when creating job orders.
        </p>
      </div>
      <JobCategoryForm
        mode="create"
        defaultValues={{
          name: "",
          slug: "",
          description: "",
          isActive: true,
        }}
      />
    </div>
  );
}
