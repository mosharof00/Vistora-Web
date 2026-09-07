"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

export type CandidateListRow = {
  id: string;
  candidate_code: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  status: string;
  source: string;
  primary_agent_id: string | null;
  agent_name: string | null;
  auth_user_id: string | null;
  has_photo: boolean;
};

export function CandidatesTable({
  candidates,
}: {
  candidates: CandidateListRow[];
}) {
  if (candidates.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">No candidates yet.</p>
        <Link
          href="/admin/candidates/new"
          className={cn(buttonVariants(), "mt-4")}
        >
          Add candidate
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/40 text-muted-foreground">
              <th className="w-14 px-4 py-3 font-medium" />
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Source / Agent</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr
                key={c.id}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-4 py-3">
                  <Avatar
                    name={c.full_name}
                    src={
                      c.has_photo
                        ? `/api/avatars/candidates/${c.id}`
                        : null
                    }
                    size="sm"
                  />
                </td>
                <td className="px-4 py-3 font-medium tabular-nums">
                  <Link
                    href={`/admin/candidates/${c.id}`}
                    className="text-primary hover:underline"
                  >
                    {c.candidate_code}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{c.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.auth_user_id ? "Has login" : "No login yet"}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <p>{c.phone || "—"}</p>
                  <p className="text-xs">{c.email || ""}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="capitalize">
                    {formatStatusLabel(c.source)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.agent_name || "—"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge tone={statusTone(c.status)}>
                    {formatStatusLabel(c.status)}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/candidates/${c.id}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" })
                    )}
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/candidates/${c.id}/edit`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "gap-1.5"
                    )}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
