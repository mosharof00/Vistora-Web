"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createJobOrder,
  updateJobOrder,
} from "@/app/(dashboard)/admin/job-orders/actions";
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
  JOB_ORDER_COUNTRY_OPTIONS,
  JOB_ORDER_STATUS_OPTIONS,
  TICKET_PROVISION_OPTIONS,
  jobOrderSchema,
  type JobOrderInput,
} from "@/lib/validations/job-order";

type Option = { id: string; label: string };
type CurrencyOption = { code: string; name: string };

export function JobOrderForm({
  mode,
  orderId,
  defaultValues,
  companies,
  categories,
  currencies,
}: {
  mode: "create" | "edit";
  orderId?: string;
  defaultValues: JobOrderInput;
  companies: Option[];
  categories: Option[];
  currencies: CurrencyOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<JobOrderInput>({
    resolver: zodResolver(jobOrderSchema),
    defaultValues,
  });

  function onSubmit(values: JobOrderInput) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createJobOrder(values)
          : await updateJobOrder(orderId!, values);

      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "New job order" : "Edit job order"}
        </CardTitle>
        <CardDescription>
          A deal under an employer: worker quota, salary, and ticket
          responsibility.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="orderCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order code</FormLabel>
                    <FormControl>
                      <Input placeholder="JO-2026-004" {...field} />
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
                        {JOB_ORDER_STATUS_OPTIONS.map((opt) => (
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
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Construction workers — Riyadh"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employerCompanyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employer company</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        <option value="">Select company</option>
                        {companies.map((c) => (
                          <option key={c.id} value={c.id}>
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
                    <FormLabel>Job category</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        <option value="">Select category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
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
                name="countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination country</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        {JOB_ORDER_COUNTRY_OPTIONS.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label} ({c.code})
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
                name="requiredCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workers needed</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={Number.isFinite(field.value) ? field.value : 1}
                        onChange={(e) => {
                          const n = e.target.valueAsNumber;
                          field.onChange(Number.isFinite(n) ? n : 1);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ticketProvision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket provision</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        {TICKET_PROVISION_OPTIONS.map((opt) => (
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
              <FormField
                control={form.control}
                name="contractDurationMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract months</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={
                          field.value === null || field.value === undefined
                            ? ""
                            : field.value
                        }
                        onChange={(e) => {
                          const n = e.target.valueAsNumber;
                          field.onChange(Number.isFinite(n) ? n : null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receivedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Received date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium">Salary / offer</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="salaryAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={
                            field.value === null || field.value === undefined
                              ? ""
                              : field.value
                          }
                          onChange={(e) => {
                            const n = e.target.valueAsNumber;
                            field.onChange(Number.isFinite(n) ? n : null);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salaryCurrencyCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <select {...field} className={selectFieldClassName()}>
                          <option value="">—</option>
                          {currencies.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} — {c.name}
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
                  name="salaryBdt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approx. BDT</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={
                            field.value === null || field.value === undefined
                              ? ""
                              : field.value
                          }
                          onChange={(e) => {
                            const n = e.target.valueAsNumber;
                            field.onChange(Number.isFinite(n) ? n : null);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salaryOfferText"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-3">
                      <FormLabel>Offer text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Optional free-text salary note"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Internal notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Saving…"
                  : mode === "create"
                    ? "Create job order"
                    : "Save changes"}
              </Button>
              <Link
                href="/admin/job-orders"
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
