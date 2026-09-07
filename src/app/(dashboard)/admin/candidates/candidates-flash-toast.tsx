"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function CandidatesFlashToast({
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
      createdMessage="Candidate created."
      updatedMessage="Candidate updated."
      toastId="candidates"
    />
  );
}
