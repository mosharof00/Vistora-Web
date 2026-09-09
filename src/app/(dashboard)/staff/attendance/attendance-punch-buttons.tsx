"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { punchAttendance } from "@/app/(dashboard)/staff/attendance/actions";
import { Button } from "@/components/ui/button";

export function AttendancePunchButtons({
  hasCheckIn,
  hasCheckOut,
}: {
  hasCheckIn: boolean;
  hasCheckOut: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function punch(type: "in" | "out") {
    startTransition(async () => {
      const result = await punchAttendance(type);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(type === "in" ? "Checked in." : "Checked out.");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        size="lg"
        className="min-w-36 gap-2 rounded-full"
        disabled={isPending || hasCheckIn}
        onClick={() => punch("in")}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogIn className="size-4" />
        )}
        Check in
      </Button>
      <Button
        type="button"
        size="lg"
        variant="secondary"
        className="min-w-36 gap-2 rounded-full"
        disabled={isPending || !hasCheckIn || hasCheckOut}
        onClick={() => punch("out")}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LogOut className="size-4" />
        )}
        Check out
      </Button>
    </div>
  );
}
