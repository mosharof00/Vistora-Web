"use client";

import { useMemo, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createCompanyPayment,
  updateCompanyPayment,
} from "@/app/(dashboard)/admin/company-payments/actions";
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
  COMPANY_PAYMENT_KIND_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  companyPaymentSchema,
  type CompanyPaymentInput,
} from "@/lib/validations/company-payment";

type Option = { id: string; label: string };
type OrderOption = { id: string; label: string; companyId: string };
type CurrencyOption = { code: string; name: string };

export function CompanyPaymentForm({
  mode,
  paymentId,
  defaultValues,
  companies,
  orders,
  gateways,
  currencies,
}: {
  mode: "create" | "edit";
  paymentId?: string;
  defaultValues: CompanyPaymentInput;
  companies: Option[];
  orders: OrderOption[];
  gateways: Option[];
  currencies: CurrencyOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<CompanyPaymentInput>({
    resolver: zodResolver(companyPaymentSchema),
    defaultValues,
  });

  const companyId = form.watch("employerCompanyId");
  const filteredOrders = useMemo(
    () =>
      companyId
        ? orders.filter((o) => o.companyId === companyId)
        : orders,
    [orders, companyId]
  );

  function onSubmit(values: CompanyPaymentInput) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createCompanyPayment(values)
          : await updateCompanyPayment(paymentId!, values);

      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Record company payment" : "Edit payment"}
        </CardTitle>
        <CardDescription>
          Money between Vistora and an employer — advances, fees, reimbursements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="employerCompanyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employer company</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className={selectFieldClassName()}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        form.setValue("jobOrderId", "");
                      }}
                    >
                      <option value="">Select company…</option>
                      {companies.map((opt) => (
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

            <FormField
              control={form.control}
              name="jobOrderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job order (optional)</FormLabel>
                  <FormControl>
                    <select {...field} className={selectFieldClassName()}>
                      <option value="">No linked order</option>
                      {filteredOrders.map((opt) => (
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
                name="kind"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kind</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        {COMPANY_PAYMENT_KIND_OPTIONS.map((opt) => (
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
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        {PAYMENT_METHOD_OPTIONS.map((opt) => (
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

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={field.value ?? ""}
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
                name="currencyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
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
                name="amountBdt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount BDT</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="paymentGatewayId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gateway (optional)</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        <option value="">None</option>
                        {gateways.map((opt) => (
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
              <FormField
                control={form.control}
                name="paidAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid date</FormLabel>
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
              name="referenceNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference</FormLabel>
                  <FormControl>
                    <Input placeholder="CPAY-…" {...field} />
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
                    ? "Record payment"
                    : "Save changes"}
              </Button>
              <Link
                href="/admin/company-payments"
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
