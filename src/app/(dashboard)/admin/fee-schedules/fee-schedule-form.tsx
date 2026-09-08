"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createFeeSchedule,
  updateFeeSchedule,
} from "@/app/(dashboard)/admin/fee-schedules/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { selectFieldClassName } from "@/components/ui/select-field";
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
  COUNTRY_OPTIONS,
  feeScheduleSchema,
  type FeeScheduleFormValues,
} from "@/lib/validations/fee-schedule";

type CategoryOption = { id: string; name: string };

export function FeeScheduleForm({
  mode,
  scheduleId,
  defaultValues,
  categories,
}: {
  mode: "create" | "edit";
  scheduleId?: string;
  defaultValues: FeeScheduleFormValues;
  categories: CategoryOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<FeeScheduleFormValues>({
    resolver: zodResolver(feeScheduleSchema),
    defaultValues,
  });

  function onSubmit(values: FeeScheduleFormValues) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createFeeSchedule(values)
          : await updateFeeSchedule(scheduleId!, values);

      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "New fee schedule" : "Edit fee schedule"}
        </CardTitle>
        <CardDescription>
          Standard candidate fees by country and job category.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Saudi processing fee" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="feeCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="FEE-KSA-PROC"
                        className="font-mono text-sm uppercase"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="amountBdt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (BDT)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="BDT"
                        className="font-mono uppercase"
                        maxLength={3}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country (optional)</FormLabel>
                    <FormControl>
                      <select
                        className={selectFieldClassName()}
                        {...field}
                        value={field.value ?? ""}
                      >
                        <option value="">Any country</option>
                        {COUNTRY_OPTIONS.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobCategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job category (optional)</FormLabel>
                    <FormControl>
                      <select
                        className={selectFieldClassName()}
                        {...field}
                        value={field.value ?? ""}
                      >
                        <option value="">Any category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Optional" {...field} />
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
                    ? "Create fee schedule"
                    : "Save changes"}
              </Button>
              <Link
                href="/admin/fee-schedules"
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
