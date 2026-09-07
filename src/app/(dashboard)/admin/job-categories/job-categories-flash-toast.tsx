"use client";

import { ListFlashToast } from "@/components/layout/list-flash-toast";

export function JobCategoriesFlashToast({
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
      createdMessage="Job category created."
      updatedMessage="Job category updated."
      toastId="job-categories"
    />
  );
}
