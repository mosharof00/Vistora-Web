"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function CompaniesFlashToast({
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
      createdMessage="Employer company created."
      updatedMessage="Employer company updated."
      toastId="companies"
    />
  );
}
