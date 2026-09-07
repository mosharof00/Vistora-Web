"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function CasesFlashToast({
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
      createdMessage="Case created."
      updatedMessage="Case updated."
      toastId="cases"
    />
  );
}
