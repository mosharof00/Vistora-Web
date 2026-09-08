import { notFound } from "next/navigation";

import { PaymentGatewayForm } from "@/app/(dashboard)/admin/payment-gateways/payment-gateway-form";
import { PageBackLink } from "@/components/layout/page-back-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";

export default async function EditPaymentGatewayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: gateway, error } = await supabase
    .from("payment_gateways")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !gateway) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <PageBackLink
            href="/admin/payment-gateways"
            label="Back to payment gateways"
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit payment gateway
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{gateway.name}</p>
        </div>
        <StatusBadge tone={gateway.is_active ? "success" : "neutral"}>
          {gateway.is_active ? "Active" : "Inactive"}
        </StatusBadge>
      </div>

      <PaymentGatewayForm
        mode="edit"
        gatewayId={gateway.id}
        defaultValues={{
          code: gateway.code,
          name: gateway.name,
          kind: gateway.kind,
          accountName: gateway.account_name ?? "",
          accountNumber: gateway.account_number ?? "",
          bankName: gateway.bank_name ?? "",
          branchName: gateway.branch_name ?? "",
          instructions: gateway.instructions ?? "",
          sortOrder: gateway.sort_order,
          isActive: gateway.is_active,
        }}
      />
    </div>
  );
}
