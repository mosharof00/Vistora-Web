import { PaymentGatewayForm } from "@/app/(dashboard)/admin/payment-gateways/payment-gateway-form";
import { PageBackLink } from "@/components/layout/page-back-link";

export default function NewPaymentGatewayPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <PageBackLink
          href="/admin/payment-gateways"
          label="Back to payment gateways"
        />
        <h1 className="text-2xl font-semibold tracking-tight">
          Add payment gateway
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Used when recording company and candidate payments.
        </p>
      </div>
      <PaymentGatewayForm
        mode="create"
        defaultValues={{
          code: "",
          name: "",
          kind: "cash",
          accountName: "",
          accountNumber: "",
          bankName: "",
          branchName: "",
          instructions: "",
          sortOrder: 50,
          isActive: true,
        }}
      />
    </div>
  );
}
