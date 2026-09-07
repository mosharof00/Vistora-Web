"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { resendEmployeeInvite } from "@/app/(dashboard)/admin/employees/actions";
import { Button } from "@/components/ui/button";

export function ResendInviteButton({ employeeId }: { employeeId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await resendEmployeeInvite(employeeId);
          if (result?.error) {
            toast.error(result.error);
            return;
          }
          toast.success("Invite email sent.");
        });
      }}
    >
      {isPending ? "Sending…" : "Resend invite"}
    </Button>
  );
}
