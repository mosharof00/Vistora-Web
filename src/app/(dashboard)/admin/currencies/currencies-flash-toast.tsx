"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function CurrenciesFlashToast({
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
      createdMessage="Currency created."
      updatedMessage="Currency updated."
      toastId="currencies"
    />
  );
}
