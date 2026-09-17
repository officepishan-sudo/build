"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createPaymentAction, type PaymentFormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const initialState: PaymentFormState = null;

export function CreatePaymentForm({ projectId }: { projectId: string }) {
  const action = createPaymentAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">תיעוד תשלום חדש</h2>
      <p className="mb-3 text-xs text-gray-400">
        זה תיעוד בלבד - אין כאן חיוב או סליקה בפועל, ורישום כאן לא יוצר או משנה הוצאה.
      </p>
      <form action={formAction} className="space-y-3">
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <div>
          <label htmlFor="payeeName" className="mb-1 block text-sm font-medium text-gray-700">
            למי משולם
          </label>
          <input
            id="payeeName"
            name="payeeName"
            required
            placeholder="למשל: קבלן השלד"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {state?.fieldErrors?.payeeName?.[0] && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.payeeName[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700">
            סכום לתשלום
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="1"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="mb-1 block text-sm font-medium text-gray-700">
            מועד יעד (לא חובה)
          </label>
          <input id="dueDate" name="dueDate" type="date" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <SubmitButton />
      </form>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "מתעד..." : "תיעוד תשלום"}
    </Button>
  );
}
