"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function PaymentGatewaysFlashToast({
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
      createdMessage="Payment gateway created."
      updatedMessage="Payment gateway updated."
      toastId="payment-gateways"
    />
  );
}
