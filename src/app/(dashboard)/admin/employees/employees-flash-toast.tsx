"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function EmployeesFlashToast({
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
      createdMessage="Employee invited."
      updatedMessage="Employee updated."
      toastId="employees"
    />
  );
}
