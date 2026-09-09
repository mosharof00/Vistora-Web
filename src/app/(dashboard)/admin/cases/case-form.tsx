"use client";

import { useMemo, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createCandidateCase,
  updateCandidateCase,
} from "@/app/(dashboard)/admin/cases/actions";
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
  CASE_STATUS_OPTIONS,
  candidateCaseSchema,
  type CandidateCaseInput,
} from "@/lib/validations/candidate-case";

type Option = { id: string; label: string };
type BatchOption = {
  id: string;
  label: string;
  jobOrderId: string;
};

export function CandidateCaseForm({
  mode,
  caseId,
  defaultValues,
  candidates,
  batches,
  agents,
  staff,
  basePath = "/admin/cases",
}: {
  mode: "create" | "edit";
  caseId?: string;
  defaultValues: CandidateCaseInput;
  candidates: Option[];
  batches: BatchOption[];
  agents: Option[];
  staff: Option[];
  basePath?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<CandidateCaseInput>({
    resolver: zodResolver(candidateCaseSchema),
    defaultValues,
  });

  const selectedBatchId = form.watch("visaBatchId");
  const selectedBatch = useMemo(
    () => batches.find((b) => b.id === selectedBatchId),
    [batches, selectedBatchId]
  );

  function onSubmit(values: CandidateCaseInput) {
    const batch = batches.find((b) => b.id === values.visaBatchId);
    const payload = {
      ...values,
      jobOrderId: batch?.jobOrderId ?? values.jobOrderId,
    };

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createCandidateCase(payload)
          : await updateCandidateCase(caseId!, payload);

      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "New case" : "Edit case"}
        </CardTitle>
        <CardDescription>
          Assign a candidate to a visa batch. Process steps are created
          automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="caseCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case code</FormLabel>
                    <FormControl>
                      <Input placeholder="CASE-2026-005" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="overallStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overall status</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        {CASE_STATUS_OPTIONS.map((opt) => (
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
              name="candidateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate</FormLabel>
                  <FormControl>
                    <select {...field} className={selectFieldClassName()}>
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
              name="visaBatchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visa batch</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className={selectFieldClassName()}
                      onChange={(e) => {
                        const id = e.target.value;
                        field.onChange(id);
                        const batch = batches.find((b) => b.id === id);
                        if (batch) {
                          form.setValue("jobOrderId", batch.jobOrderId, {
                            shouldValidate: true,
                          });
                        }
                      }}
                    >
                      <option value="">Select visa batch…</option>
                      {batches.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                  {selectedBatch ? (
                    <p className="text-xs text-muted-foreground">
                      Job order is set from this batch automatically.
                    </p>
                  ) : null}
                </FormItem>
              )}
            />

            <input type="hidden" {...form.register("jobOrderId")} />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="agentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent (optional)</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        <option value="">No agent</option>
                        {agents.map((opt) => (
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
                name="assignedStaffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned staff</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        <option value="">Unassigned</option>
                        {staff.map((opt) => (
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="mofaNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MOFA number</FormLabel>
                    <FormControl>
                      <Input placeholder="MOFA-…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="processingOffice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processing office</FormLabel>
                    <FormControl>
                      <Input placeholder="Dhaka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="flightDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flight date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flightNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flight number</FormLabel>
                    <FormControl>
                      <Input placeholder="BG-147" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tradeRemark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trade remark</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional trade note" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Optional remarks" {...field} />
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
                    ? "Create case"
                    : "Save changes"}
              </Button>
              <Link
                href={
                  mode === "edit" && caseId
                    ? `${basePath}/${caseId}`
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
