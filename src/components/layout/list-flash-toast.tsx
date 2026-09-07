"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * One success toast after create/update redirect (?created=1 | ?updated=1).
 * Dedupes Strict Mode / remount double-fires.
 */
export function ListFlashToast({
  created,
  updated,
  createdMessage,
  updatedMessage,
  toastId,
}: {
  created: boolean;
  updated: boolean;
  createdMessage: string;
  updatedMessage: string;
  toastId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const handled = useRef(false);

  useEffect(() => {
    if ((!created && !updated) || handled.current) return;
    handled.current = true;

    if (created) {
      toast.success(createdMessage, { id: `${toastId}-created` });
    } else if (updated) {
      toast.success(updatedMessage, { id: `${toastId}-updated` });
    }

    router.replace(pathname);
  }, [
    created,
    updated,
    createdMessage,
    updatedMessage,
    toastId,
    pathname,
    router,
  ]);

  return null;
}
