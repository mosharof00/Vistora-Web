"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createVisaBatch,
  updateVisaBatch,
} from "@/app/(dashboard)/admin/visa-batches/actions";
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
  VISA_BATCH_STATUS_OPTIONS,
  visaBatchSchema,
  type VisaBatchInput,
} from "@/lib/validations/visa-batch";

type OrderOption = { id: string; label: string };

export function VisaBatchForm({
  mode,
  batchId,
  defaultValues,
  orders,
}: {
  mode: "create" | "edit";
  batchId?: string;
  defaultValues: VisaBatchInput;
  orders: OrderOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<VisaBatchInput>({
    resolver: zodResolver(visaBatchSchema),
    defaultValues,
  });

  function onSubmit(values: VisaBatchInput) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createVisaBatch(values)
          : await updateVisaBatch(batchId!, values);

      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "New visa batch" : "Edit visa batch"}
        </CardTitle>
        <CardDescription>
          A visa block under a job order — quota, visa numbers, and PRO office.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="batchCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch code</FormLabel>
                    <FormControl>
                      <Input placeholder="VB-KSA-002" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        {VISA_BATCH_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Al Noor Visa Block B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobOrderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job order</FormLabel>
                  <FormControl>
                    <select {...field} className={selectFieldClassName()}>
                      <option value="">Select job order…</option>
                      {orders.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="visaNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visa number</FormLabel>
                    <FormControl>
                      <Input placeholder="VISA-…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visaIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visa ID number</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="quotaCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quota (seats)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? null : Number(v));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="openedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opened</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="closedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Closed</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="proOffice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PRO office</FormLabel>
                  <FormControl>
                    <Input placeholder="Dhaka PRO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Optional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Saving…"
                  : mode === "create"
                    ? "Create batch"
                    : "Save changes"}
              </Button>
              <Link
                href={
                  mode === "edit" && batchId
                    ? `/admin/visa-batches/${batchId}`
                    : "/admin/visa-batches"
                }
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
