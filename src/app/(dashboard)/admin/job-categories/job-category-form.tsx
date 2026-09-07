"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createJobCategory,
  updateJobCategory,
} from "@/app/(dashboard)/admin/job-categories/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  jobCategorySchema,
  type JobCategoryFormValues,
} from "@/lib/validations/job-category";

export function JobCategoryForm({
  mode,
  categoryId,
  defaultValues,
}: {
  mode: "create" | "edit";
  categoryId?: string;
  defaultValues: JobCategoryFormValues;
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<JobCategoryFormValues>({
    resolver: zodResolver(jobCategorySchema),
    defaultValues,
  });

  function onSubmit(values: JobCategoryFormValues) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createJobCategory(values)
          : await updateJobCategory(categoryId!, values);

      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "New job category" : "Edit job category"}
        </CardTitle>
        <CardDescription>
          Categories power job orders (e.g. Heavy Driver, Housekeeping).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Heavy Driver" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="heavy-driver — blank = from name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Optional notes for staff"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="size-4 rounded border-input"
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Active</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Saving…"
                  : mode === "create"
                    ? "Create category"
                    : "Save changes"}
              </Button>
              <Link
                href="/admin/job-categories"
                className={buttonVariants({ variant: "outline" })}
              >
                Cancel
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
