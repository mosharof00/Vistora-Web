"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { setPassportCurrent } from "@/app/(dashboard)/admin/passports/actions";
import { Button } from "@/components/ui/button";

export function SetCurrentPassportButton({
  passportId,
  candidateId,
}: {
  passportId: string;
  candidateId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="secondary"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await setPassportCurrent(passportId, candidateId);
          if (result?.error) {
            toast.error(result.error);
            return;
          }
          toast.success("Marked as current passport.");
          router.refresh();
        });
      }}
    >
      {isPending ? "Updating…" : "Mark as current"}
    </Button>
  );
}
