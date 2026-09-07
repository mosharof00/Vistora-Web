"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import { setAgentStatus } from "@/app/(dashboard)/admin/agents/actions";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";

type Agent = Database["public"]["Tables"]["agents"]["Row"];

function commissionLabel(agent: Agent) {
  if (agent.commission_type === "percent") {
    return `${agent.commission_value}%`;
  }
  return `৳${Number(agent.commission_value).toLocaleString("en-BD")}`;
}

export function AgentsTable({ agents }: { agents: Agent[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggleStatus(agent: Agent) {
    const next = agent.status === "active" ? "inactive" : "active";
    startTransition(async () => {
      const result = await setAgentStatus(agent.id, next);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(
        next === "active" ? "Agent marked active." : "Agent marked inactive."
      );
      router.refresh();
    });
  }

  if (agents.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">No agents yet.</p>
        <Link href="/admin/agents/new" className={cn(buttonVariants(), "mt-4")}>
          Add agent
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/40 text-muted-foreground">
              <th className="w-14 px-4 py-3 font-medium" />
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Agent</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Commission</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr
                key={agent.id}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-4 py-3">
                  <Avatar name={agent.full_name} size="sm" />
                </td>
                <td className="px-4 py-3 font-medium tabular-nums">
                  <Link
                    href={`/admin/agents/${agent.id}`}
                    className="text-primary hover:underline"
                  >
                    {agent.agent_code}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{agent.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {agent.agency_name || agent.district || "—"}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <p>{agent.phone || "—"}</p>
                  <p className="text-xs">{agent.email || ""}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium tabular-nums">
                    {commissionLabel(agent)}
                  </p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {agent.commission_type.replaceAll("_", " ")}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => toggleStatus(agent)}
                    title="Click to toggle status"
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <StatusBadge tone={statusTone(agent.status)}>
                      {formatStatusLabel(agent.status)}
                    </StatusBadge>
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/agents/${agent.id}`}
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
