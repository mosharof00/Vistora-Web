"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function PassportsFlashToast({
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
      createdMessage="Passport created."
      updatedMessage="Passport updated."
      toastId="passports"
    />
  );
}
