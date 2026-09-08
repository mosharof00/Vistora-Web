"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  uploadAdminAvatar,
  uploadCandidatePhoto,
  uploadEmployeeAvatar,
} from "@/app/(dashboard)/admin/avatars/actions";
import { Avatar } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProfilePhotoCard({
  kind,
  ownerId,
  name,
  hasPhoto,
}: {
  kind: "employees" | "candidates" | "admins";
  ownerId: string;
  name: string;
  hasPhoto: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const src = hasPhoto ? `/api/avatars/${kind}/${ownerId}` : null;

  function onPick(file: File | undefined) {
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    startTransition(async () => {
      const result =
        kind === "admins"
          ? await uploadAdminAvatar(fd)
          : kind === "employees"
            ? await uploadEmployeeAvatar(ownerId, fd)
            : await uploadCandidatePhoto(ownerId, fd);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Profile photo updated.");
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-secondary/55 px-4 py-4 ring-1 ring-border/50">
      <div className="relative">
        <Avatar name={name} src={src} size="lg" />
        {isPending ? (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35">
            <Loader2 className="size-5 animate-spin text-white" />
          </span>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Profile photo</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          JPG, PNG, or WebP up to 5 MB
        </p>
        <div className="mt-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(e) => onPick(e.target.files?.[0])}
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
            <Camera className="size-3.5" />
            {hasPhoto ? "Change photo" : "Upload photo"}
          </button>
        </div>
      </div>
    </div>
  );
}
