"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { setJobCategoryActive } from "@/app/(dashboard)/admin/job-categories/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type JobCategoryListRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
};

export function JobCategoriesTable({
  categories,
}: {
  categories: JobCategoryListRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggleActive(row: JobCategoryListRow) {
    startTransition(async () => {
      const result = await setJobCategoryActive(row.id, !row.is_active);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(
        row.is_active ? "Category deactivated." : "Category activated."
      );
      router.refresh();
    });
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">No job categories yet.</p>
        <Link
          href="/admin/job-categories/new"
          className={cn(buttonVariants(), "mt-4")}
        >
          Add category
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/40 text-muted-foreground">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/job-categories/${row.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {row.name}
                  </Link>
                  {row.description ? (
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {row.description}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {row.slug}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => toggleActive(row)}
                    title="Click to toggle"
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <StatusBadge tone={row.is_active ? "success" : "neutral"}>
                      {row.is_active ? "Active" : "Inactive"}
                    </StatusBadge>
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/job-categories/${row.id}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "gap-1.5"
                    )}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
