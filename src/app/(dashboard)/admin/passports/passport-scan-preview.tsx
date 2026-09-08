"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { getPassportScanSignedUrl } from "@/app/(dashboard)/admin/passports/actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PassportScanPreview({
  path,
  label,
}: {
  path: string | null;
  label: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!path) {
      setUrl(null);
      return;
    }
    startTransition(async () => {
      const result = await getPassportScanSignedUrl(path);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setUrl(result.url);
    });
  }, [path]);

  if (!path) {
    return (
      <div className="rounded-xl bg-secondary/40 px-4 py-8 text-center text-sm text-muted-foreground">
        No {label.toLowerCase()} uploaded
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{label}</p>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Open
          </a>
        ) : null}
      </div>
      {isPending && !url ? (
        <p className="text-xs text-muted-foreground">Loading preview…</p>
      ) : null}
      {url ? (
        path.toLowerCase().endsWith(".pdf") ? (
          <iframe
            title={label}
            src={url}
            className="h-64 w-full rounded-xl bg-secondary/30 ring-1 ring-border/60"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={label}
            className="max-h-80 w-full rounded-xl object-contain bg-secondary/30 ring-1 ring-border/60"
          />
        )
      ) : (
        <p className="truncate text-xs text-muted-foreground">{path}</p>
      )}
    </div>
  );
}
