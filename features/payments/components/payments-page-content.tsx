import { PaymentsList } from "./payments-list";
import { CreatePaymentForm } from "./create-payment-form";

export function PaymentsPageContent({ userId, projectId }: { userId: string; projectId: string }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <PaymentsList userId={userId} projectId={projectId} />
      </div>
      <div>
        <CreatePaymentForm projectId={projectId} />
      </div>
    </div>
  );
}
