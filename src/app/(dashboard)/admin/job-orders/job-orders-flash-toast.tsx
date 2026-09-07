"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function JobOrdersFlashToast({
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
      createdMessage="Job order created."
      updatedMessage="Job order updated."
      toastId="job-orders"
    />
  );
}
