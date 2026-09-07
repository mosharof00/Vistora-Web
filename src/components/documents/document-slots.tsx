"use client";

import { useRef, useState, useTransition } from "react";
import { FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { uploadDocument } from "@/app/(dashboard)/admin/documents/actions";
import { buttonVariants } from "@/components/ui/button";
import type { DocSlot, DocumentOwnerType } from "@/lib/documents/config";
import { cn } from "@/lib/utils";

export type DocumentFileRow = {
  id: string;
  doc_type: string;
  file_name: string;
  created_at: string;
};

function documentFileUrl(documentId: string, download = false) {
  return `/api/documents/${documentId}${download ? "?download=1" : ""}`;
}

export function DocumentSlotsGrid({
  ownerType,
  ownerId,
  slots,
  documents,
  columnsClassName = "sm:grid-cols-2 xl:grid-cols-3",
}: {
  ownerType: DocumentOwnerType;
  ownerId: string;
  slots: DocSlot[];
  documents: DocumentFileRow[];
  columnsClassName?: string;
}) {
  const byType = Object.fromEntries(
    slots.map((slot) => [
      slot.type,
      documents.filter((d) => d.doc_type === slot.type),
    ])
  ) as Record<string, DocumentFileRow[]>;

  return (
    <div className={cn("grid gap-3", columnsClassName)}>
      {slots.map((slot) => (
        <DocumentSlotCard
          key={slot.type}
          ownerType={ownerType}
          ownerId={ownerId}
          slot={slot}
          files={byType[slot.type] ?? []}
        />
      ))}
    </div>
  );
}

function DocumentSlotCard({
  ownerType,
  ownerId,
  slot,
  files,
}: {
  ownerType: DocumentOwnerType;
  ownerId: string;
  slot: DocSlot;
  files: DocumentFileRow[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [dragging, setDragging] = useState(false);
  const latest = files[0];

  function uploadFile(file: File | undefined | null) {
    if (!file) return;

    const fd = new FormData();
    fd.set("ownerType", ownerType);
    fd.set("ownerId", ownerId);
    fd.set("docType", slot.type);
    fd.set("file", file);

    startTransition(async () => {
      const result = await uploadDocument(fd);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(`${slot.label} uploaded.`);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        if (isPending) return;
        uploadFile(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "rounded-xl bg-secondary/50 p-4 ring-1 ring-transparent transition-colors",
        dragging && "bg-primary/5 ring-primary/40",
        isPending && "opacity-70"
      )}
    >
      <div className="flex items-start gap-2">
        <FileText className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{slot.label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{slot.hint}</p>

          {latest ? (
            <a
              href={documentFileUrl(latest.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block max-w-full truncate text-left text-xs font-medium text-primary hover:underline"
            >
              {latest.file_name}
              {files.length > 1 ? ` (+${files.length - 1} more)` : ""}
            </a>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              {dragging
                ? "Drop file to upload"
                : "No file yet — drop here or browse"}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,image/jpeg,image/png,image/webp,application/pdf"
              className="sr-only"
              onChange={(e) => uploadFile(e.target.files?.[0])}
            />
            <button
              type="button"
              disabled={isPending}
              onClick={() => inputRef.current?.click()}
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "gap-1.5"
              )}
            >
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Upload className="size-3.5" />
              )}
              {latest ? "Replace / add" : "Browse"}
            </button>
            {latest ? (
              <a
                href={documentFileUrl(latest.id, true)}
                className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
              >
                Download
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OpenDocumentButton({
  documentId,
  label = "Open",
  download = false,
  className,
}: {
  documentId: string;
  label?: string;
  download?: boolean;
  className?: string;
}) {
  return (
    <a
      href={documentFileUrl(documentId, download)}
      target={download ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        className
      )}
    >
      {label}
    </a>
  );
}
