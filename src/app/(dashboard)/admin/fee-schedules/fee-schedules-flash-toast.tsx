"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function FeeSchedulesFlashToast({
  created,
  updated,
}: {
  created: boolean;
  updated: boolean;
}) {
  return (
    <ListFlashToast
      created={created}
      updated={updated}
      createdMessage="Fee schedule created."
      updatedMessage="Fee schedule updated."
      toastId="fee-schedules"
    />
  );
}
