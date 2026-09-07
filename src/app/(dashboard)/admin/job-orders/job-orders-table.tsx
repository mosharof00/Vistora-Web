"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatStatusLabel, statusTone } from "@/lib/status";
import { cn } from "@/lib/utils";

export type JobOrderListRow = {
  id: string;
  order_code: string;
  title: string;
  status: string;
  country_code: string;
  required_count: number;
  filled_count: number;
  ticket_provision: string;
  salary_amount: number | null;
  salary_currency_code: string | null;
  company_name: string | null;
  category_name: string | null;
};

function ticketShort(value: string) {
  switch (value) {
    case "go_only":
      return "Go";
    case "return_only":
      return "Return";
    case "go_and_return":
      return "Go+Return";
    default:
      return "None";
  }
}

export function JobOrdersTable({ orders }: { orders: JobOrderListRow[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl bg-card px-6 py-12 text-center shadow-sm ring-1 ring-border/60">
        <p className="text-sm text-muted-foreground">No job orders yet.</p>
        <Link
          href="/admin/job-orders/new"
          className={cn(buttonVariants(), "mt-4")}
        >
          Add job order
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-secondary/40 text-muted-foreground">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Workers</th>
              <th className="px-4 py-3 font-medium">Salary</th>
              <th className="px-4 py-3 font-medium">Tickets</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const left = Math.max(
                0,
                order.required_count - order.filled_count
              );
              return (
                <tr
                  key={order.id}
                  className="border-b border-border/40 last:border-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/job-orders/${order.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {order.order_code}
                    </Link>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {order.title}
                      {order.category_name ? ` · ${order.category_name}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{order.company_name || "—"}</p>
                    <p className="text-xs uppercase text-muted-foreground">
                      {order.country_code}
                    </p>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {order.filled_count}/{order.required_count}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({left} left)
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {order.salary_amount != null
                      ? `${order.salary_amount.toLocaleString()} ${order.salary_currency_code ?? ""}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {ticketShort(order.ticket_provision)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={statusTone(order.status)}>
                      {formatStatusLabel(order.status)}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/job-orders/${order.id}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" })
                      )}
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/job-orders/${order.id}/edit`}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
