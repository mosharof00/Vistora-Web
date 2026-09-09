"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui/button";
import {
  acceptAttrForKind,
  acceptKindForSlot,
  acceptLabelForKind,
  validateUploadFile,
  type DocSlot,
  type DocumentOwnerType,
} from "@/lib/documents/config";
import { cn } from "@/lib/utils";

export type DocumentFileRow = {
  id: string;
  doc_type: string;
  file_name: string;
  created_at: string;
  uploaded_by_name?: string | null;
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dragging, setDragging] = useState(false);
  const latest = files[0];
  const acceptKind = acceptKindForSlot(slot);
  const acceptAttr = acceptAttrForKind(acceptKind);
  const acceptLabel = acceptLabelForKind(acceptKind);

  function uploadFile(file: File | undefined | null) {
    if (!file) return;

    const clientError = validateUploadFile(file, acceptKind);
    if (clientError) {
      toast.error(clientError);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const fd = new FormData();
    fd.set("ownerType", ownerType);
    fd.set("ownerId", ownerId);
    fd.set("docType", slot.type);
    fd.set("replace", "1");
    fd.set("file", file);

    startTransition(async () => {
      try {
        const res = await fetch("/api/documents/upload", {
          method: "POST",
          body: fd,
        });
        const payload = (await res.json().catch(() => null)) as {
          error?: string;
          ok?: boolean;
        } | null;

        if (!res.ok || payload?.error) {
          toast.error(
            payload?.error ||
              (res.status === 413
                ? "File is too large for upload."
                : "Upload failed.")
          );
          return;
        }

        toast.success(
          latest
            ? `${slot.label} replaced.`
            : `${slot.label} uploaded.`
        );
        if (inputRef.current) inputRef.current.value = "";
        router.refresh();
      } catch {
        toast.error("Upload failed. Check your connection and try again.");
      }
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
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Accepts {acceptLabel}
          </p>

          {latest ? (
            <>
              <a
                href={documentFileUrl(latest.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block max-w-full truncate text-left text-xs font-medium text-primary hover:underline"
              >
                {latest.file_name}
              </a>
              {latest.uploaded_by_name ? (
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Uploaded by {latest.uploaded_by_name}
                </p>
              ) : null}
            </>
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
              accept={acceptAttr}
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
              {latest ? "Replace" : "Browse"}
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
