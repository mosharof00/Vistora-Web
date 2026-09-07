"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function AgentsFlashToast({
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
      createdMessage="Agent created."
      updatedMessage="Agent updated."
      toastId="agents"
    />
  );
}
