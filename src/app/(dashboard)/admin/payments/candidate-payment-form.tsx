"use client";

import { useMemo, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createCandidatePayment,
  updateCandidatePayment,
} from "@/app/(dashboard)/admin/payments/actions";
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
  PAYMENT_DIRECTION_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  candidatePaymentSchema,
  type CandidatePaymentFormValues,
} from "@/lib/validations/candidate-payment";

type Option = { id: string; label: string };
type CaseOption = { id: string; label: string; candidateId: string };
type CurrencyOption = { code: string; name: string };

export function CandidatePaymentForm({
  mode,
  paymentId,
  defaultValues,
  candidates,
  cases,
  feeSchedules,
  gateways,
  currencies,
  basePath = "/admin/payments",
}: {
  mode: "create" | "edit";
  paymentId?: string;
  defaultValues: CandidatePaymentFormValues;
  candidates: Option[];
  cases: CaseOption[];
  feeSchedules: Option[];
  gateways: Option[];
  currencies: CurrencyOption[];
  basePath?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<CandidatePaymentFormValues>({
    resolver: zodResolver(candidatePaymentSchema),
    defaultValues,
  });

  const candidateId = form.watch("candidateId");
  const filteredCases = useMemo(
    () =>
      candidateId
        ? cases.filter((c) => c.candidateId === candidateId)
        : cases,
    [cases, candidateId]
  );

  function onSubmit(values: CandidatePaymentFormValues) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createCandidatePayment(values)
          : await updateCandidatePayment(paymentId!, values);

      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Record candidate payment" : "Edit payment"}
        </CardTitle>
        <CardDescription>
          Fees received from (or refunded to) a candidate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="candidateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className={selectFieldClassName()}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        form.setValue("candidateCaseId", "");
                      }}
                    >
                      <option value="">Select candidate…</option>
                      {candidates.map((opt) => (
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
              name="candidateCaseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case (optional)</FormLabel>
                  <FormControl>
                    <select {...field} className={selectFieldClassName()}>
                      <option value="">No linked case</option>
                      {filteredCases.map((opt) => (
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
              name="feeScheduleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee schedule (optional)</FormLabel>
                  <FormControl>
                    <select {...field} className={selectFieldClassName()}>
                      <option value="">None</option>
                      {feeSchedules.map((opt) => (
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
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direction</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        {PAYMENT_DIRECTION_OPTIONS.map((opt) => (
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

            <FormField
              control={form.control}
              name="referenceNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference</FormLabel>
                  <FormControl>
                    <Input placeholder="BKASH-…" {...field} />
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
                href={
                  mode === "edit" && paymentId
                    ? `${basePath}/${paymentId}`
                    : basePath
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
