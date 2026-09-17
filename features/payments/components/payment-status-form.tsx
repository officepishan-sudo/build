"use client";

import { useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { markPaymentPaidAction, updatePaymentStatusAction, type PaymentFormState } from "../actions";
import { Button } from "@/components/ui/button";
import { PAYMENT_STATUS_LABEL } from "../constants";
import type { PaymentStatus } from "@prisma/client";

const initialState: PaymentFormState = null;

export function PaymentStatusForm({
  projectId,
  paymentId,
  status,
}: {
  projectId: string;
  paymentId: string;
  status: PaymentStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const action = updatePaymentStatusAction.bind(null, projectId, paymentId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status !== "PAID" && (
        <Button
          type="button"
          variant="secondary"
          disabled={isPending}
          onClick={() => startTransition(() => markPaymentPaidAction(projectId, paymentId))}
        >
          סימון כשולם
        </Button>
      )}
      <form action={formAction} className="flex items-center gap-2">
        <select name="status" defaultValue={status} className="rounded-md border border-gray-300 px-2 py-1 text-xs">
          {Object.entries(PAYMENT_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <UpdateButton />
      </form>
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
    </div>
  );
}

function UpdateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="ghost" disabled={pending}>
      {pending ? "מעדכן..." : "עדכון סטטוס"}
    </Button>
  );
}
