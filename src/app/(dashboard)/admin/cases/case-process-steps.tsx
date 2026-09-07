"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateCaseProcessStep } from "@/app/(dashboard)/admin/cases/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { selectFieldClassName } from "@/components/ui/select-field";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { PROCESS_STEP_STATUS_OPTIONS } from "@/lib/validations/candidate-case";

export type ProcessStepRow = {
  step_code: string;
  label: string;
  sort_order: number;
  status: string;
  reference_no: string | null;
  event_date: string | null;
  notes: string | null;
};

export function CaseProcessSteps({
  caseId,
  steps,
}: {
  caseId: string;
  steps: ProcessStepRow[];
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (steps.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No process steps seeded for this case.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border/60">
      {steps.map((step) => {
        const isOpen = editing === step.step_code;
        return (
          <li key={step.step_code} className="py-3 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium">{step.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {step.reference_no
                    ? `Ref ${step.reference_no}`
                    : step.step_code}
                  {step.event_date
                    ? ` · ${new Date(step.event_date).toLocaleDateString("en-GB")}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge tone={statusTone(step.status)}>
                  {formatStatusLabel(step.status)}
                </StatusBadge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setEditing(isOpen ? null : step.step_code)
                  }
                >
                  {isOpen ? "Close" : "Update"}
                </Button>
              </div>
            </div>

            {isOpen ? (
              <form
                className="mt-3 grid gap-3 rounded-xl bg-secondary/40 p-3 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  startTransition(async () => {
                    const result = await updateCaseProcessStep(
                      caseId,
                      step.step_code,
                      {
                        status: String(fd.get("status") ?? step.status) as
                          | "pending"
                          | "in_progress"
                          | "done"
                          | "failed"
                          | "waived"
                          | "not_required",
                        referenceNo: String(fd.get("referenceNo") ?? ""),
                        eventDate: String(fd.get("eventDate") ?? ""),
                        notes: String(fd.get("notes") ?? ""),
                      }
                    );
                    if (result?.error) {
                      toast.error(result.error);
                      return;
                    }
                    toast.success(`${step.label} updated.`);
                    setEditing(null);
                  });
                }}
              >
                <label className="space-y-1 text-xs">
                  <span className="text-muted-foreground">Status</span>
                  <select
                    name="status"
                    defaultValue={step.status}
                    className={selectFieldClassName()}
                  >
                    {PROCESS_STEP_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 text-xs">
                  <span className="text-muted-foreground">Reference</span>
                  <Input
                    name="referenceNo"
                    defaultValue={step.reference_no ?? ""}
                    placeholder="Optional ref"
                  />
                </label>
                <label className="space-y-1 text-xs">
                  <span className="text-muted-foreground">Event date</span>
                  <Input
                    type="date"
                    name="eventDate"
                    defaultValue={step.event_date ?? ""}
                  />
                </label>
                <label className="space-y-1 text-xs">
                  <span className="text-muted-foreground">Notes</span>
                  <Input
                    name="notes"
                    defaultValue={step.notes ?? ""}
                    placeholder="Optional note"
                  />
                </label>
                <div className="sm:col-span-2">
                  <Button type="submit" size="sm" disabled={isPending}>
                    {isPending ? "Saving…" : "Save step"}
                  </Button>
                </div>
              </form>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
