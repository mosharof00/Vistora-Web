"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { setPaymentGatewayActive } from "@/app/(dashboard)/admin/payment-gateways/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { GATEWAY_KIND_OPTIONS } from "@/lib/validations/payment-gateway";
import { cn } from "@/lib/utils";

export type PaymentGatewayListRow = {
  id: string;
  code: string;
  name: string;
  kind: string;
  account_number: string | null;
  bank_name: string | null;
  is_active: boolean;
  sort_order: number;
};

function kindLabel(kind: string) {
  return (
    GATEWAY_KIND_OPTIONS.find((o) => o.value === kind)?.label ?? kind
  );
}

export function PaymentGatewaysTable({
  gateways,
}: {
  gateways: PaymentGatewayListRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggleActive(row: PaymentGatewayListRow) {
    startTransition(async () => {
      const result = await setPaymentGatewayActive(row.id, !row.is_active);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(
        row.is_active ? "Gateway deactivated." : "Gateway activated."
      );
      router.refresh();
    });
  }

  if (gateways.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">No payment gateways yet.</p>
        <Link
          href="/admin/payment-gateways/new"
          className={cn(buttonVariants(), "mt-4")}
        >
          Add gateway
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
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Kind</th>
              <th className="px-4 py-3 font-medium">Account</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {gateways.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/payment-gateways/${row.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {row.name}
                  </Link>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {row.code}
                  </p>
                </td>
                <td className="px-4 py-3">{kindLabel(row.kind)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.account_number || row.bank_name || "—"}
                </td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {row.sort_order}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => toggleActive(row)}
                    title="Click to toggle"
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <StatusBadge tone={row.is_active ? "success" : "neutral"}>
                      {row.is_active ? "Active" : "Inactive"}
                    </StatusBadge>
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/payment-gateways/${row.id}`}
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
