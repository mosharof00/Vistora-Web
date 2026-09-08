"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function PaymentsFlashToast({
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
      createdMessage="Candidate payment recorded."
      updatedMessage="Candidate payment updated."
      toastId="candidate-payments"
    />
  );
}
