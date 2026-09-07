"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function VisaBatchesFlashToast({
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
      createdMessage="Visa batch created."
      updatedMessage="Visa batch updated."
      toastId="visa-batches"
    />
  );
}
