"use client";

import { useRef, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createPassport,
  updatePassport,
} from "@/app/(dashboard)/admin/passports/actions";
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
import { cn } from "@/lib/utils";
import {
  PASSPORT_SEX_OPTIONS,
  PASSPORT_TYPE_OPTIONS,
  passportSchema,
  type PassportInput,
} from "@/lib/validations/passport";

type CandidateOption = { id: string; label: string };

export function PassportForm({
  mode,
  passportId,
  defaultValues,
  candidates,
  lockCandidate,
}: {
  mode: "create" | "edit";
  passportId?: string;
  defaultValues: PassportInput;
  candidates: CandidateOption[];
  lockCandidate?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const form = useForm<PassportInput>({
    resolver: zodResolver(passportSchema),
    defaultValues,
  });

  function onSubmit(values: PassportInput) {
    startTransition(async () => {
      const fd = new FormData();
      const front = frontRef.current?.files?.[0];
      const back = backRef.current?.files?.[0];
      if (front) fd.set("scanFront", front);
      if (back) fd.set("scanBack", back);

      const result =
        mode === "create"
          ? await createPassport(values, fd)
          : await updatePassport(passportId!, values, fd);

      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>
              {mode === "create" ? "New passport" : "Edit passport"}
            </CardTitle>
            <CardDescription>
              Booklet snapshot for the candidate — does not overwrite the
              candidate profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="candidateId"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Candidate</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        disabled={lockCandidate}
                        className={selectFieldClassName()}
                      >
                        <option value="">Select candidate…</option>
                        {candidates.map((c) => (
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
                name="passportNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport number</FormLabel>
                    <FormControl>
                      <Input placeholder="A22619693" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        {PASSPORT_TYPE_OPTIONS.map((opt) => (
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
                name="issuingCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country code</FormLabel>
                    <FormControl>
                      <Input placeholder="BD" maxLength={2} {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      ISO alpha-2 (BD, not BGD).
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isCurrent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current booklet</FormLabel>
                    <FormControl>
                      <select
                        className={selectFieldClassName()}
                        value={field.value ? "yes" : "no"}
                        onChange={(e) =>
                          field.onChange(e.target.value === "yes")
                        }
                      >
                        <option value="yes">Yes — mark as current</option>
                        <option value="no">No — previous / history</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Biodata page</CardTitle>
            <CardDescription>
              Fields as printed on the passport identity page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input placeholder="KHAN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="givenNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Given names</FormLabel>
                    <FormControl>
                      <Input placeholder="BILAL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullNameAsInPassport"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Full name (as in passport)</FormLabel>
                    <FormControl>
                      <Input placeholder="BILAL KHAN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationalityLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <Input placeholder="BANGLADESHI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <FormControl>
                      <select {...field} className={selectFieldClassName()}>
                        {PASSPORT_SEX_OPTIONS.map((opt) => (
                          <option key={opt.value || "unset"} value={opt.value}>
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
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="placeOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of birth</FormLabel>
                    <FormControl>
                      <Input placeholder="SUNAMGANJ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal No.</FormLabel>
                    <FormControl>
                      <Input placeholder="NID / personal number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="previousPassportNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous passport No.</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of issue</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of expiry</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issuingAuthority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuing authority</FormLabel>
                    <FormControl>
                      <Input placeholder="DIP/DHAKA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="placeOfIssue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of issue</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional alias" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Family &amp; emergency</CardTitle>
            <CardDescription>
              Observations / additional information page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father&apos;s name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="motherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mother&apos;s name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="legalGuardianName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Legal guardian</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="permanentAddress"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Permanent address</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency contact</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactRelationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="FATHER" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+880…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Scans &amp; MRZ</CardTitle>
            <CardDescription>
              Upload biodata / observations pages (JPEG, PNG, WebP, or PDF)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Scan — biodata page</label>
                <Input ref={frontRef} type="file" accept="image/*,application/pdf" />
                {defaultValues.scanFrontPath ? (
                  <p className="text-xs text-muted-foreground truncate">
                    Current: {defaultValues.scanFrontPath}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Scan — observations page
                </label>
                <Input ref={backRef} type="file" accept="image/*,application/pdf" />
                {defaultValues.scanBackPath ? (
                  <p className="text-xs text-muted-foreground truncate">
                    Current: {defaultValues.scanBackPath}
                  </p>
                ) : null}
              </div>
              <FormField
                control={form.control}
                name="mrzLine1"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>MRZ line 1</FormLabel>
                    <FormControl>
                      <Input className="font-mono text-xs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mrzLine2"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>MRZ line 2</FormLabel>
                    <FormControl>
                      <Input className="font-mono text-xs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Saving…"
              : mode === "create"
                ? "Create passport"
                : "Save changes"}
          </Button>
          <Link
            href={
              mode === "edit" && passportId
                ? `/admin/passports/${passportId}`
                : "/admin/passports"
            }
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            Cancel
          </Link>
        </div>
      </form>
    </Form>
  );
}
