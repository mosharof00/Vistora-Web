import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";

import { AgentsTable } from "@/app/(dashboard)/admin/agents/agents-table";
import { AgentsFlashToast } from "@/app/(dashboard)/admin/agents/agents-flash-toast";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function AdminAgentsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: agents, error } = await supabase
    .from("agents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl bg-card p-6 text-sm text-destructive shadow-sm">
        Could not load agents: {error.message}
      </div>
    );
  }

  const rows = agents ?? [];
  const activeCount = rows.filter((a) => a.status === "active").length;

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <AgentsFlashToast
          created={params.created === "1"}
          updated={params.updated === "1"}
        />
      </Suspense>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} total · {activeCount} active — Admin-only create/edit
          </p>
        </div>
        <Link
          href="/admin/agents/new"
          className={cn(buttonVariants(), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add agent
        </Link>
      </div>

      <AgentsTable agents={rows} />
    </div>
  );
}
