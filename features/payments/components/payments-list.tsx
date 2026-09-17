import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { AppError } from "@/lib/errors";
import { listPayments } from "../service";
import { PaymentRow } from "./payment-row";
import { CreatePaymentForm } from "./create-payment-form";

export async function PaymentsList({ userId, projectId }: { userId: string; projectId: string }) {
  let payments: Awaited<ReturnType<typeof listPayments>>;
  try {
    payments = await listPayments(userId, projectId);
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את התשלומים" description={message} />;
  }

  if (payments.length === 0) {
    return (
      <EmptyState
        title="עדיין אין תשלומים מתועדים"
        description="תיעוד תשלום עוזר לדעת למי חייבים, כמה ומתי - בלי לבצע בפועל שום חיוב."
        action={<CreatePaymentForm projectId={projectId} />}
      />
    );
  }

  return (
    <Card>
      <ul className="divide-y divide-gray-100">
        {payments.map((payment) => (
          <PaymentRow key={payment.id} projectId={projectId} payment={payment} />
        ))}
      </ul>
    </Card>
  );
}
