"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function CompanyPaymentsFlashToast({
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
      createdMessage="Company payment recorded."
      updatedMessage="Company payment updated."
      toastId="company-payments"
    />
  );
}
