"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createDeliveryFromOrderAction, type DeliveryFormState } from "../actions";
import { Button } from "@/components/ui/button";

const initialState: DeliveryFormState = null;

export function CreateDeliveryForm({ projectId, orderId }: { projectId: string; orderId: string }) {
  const [state, formAction] = useFormState(createDeliveryFromOrderAction.bind(null, projectId, orderId), initialState);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{state.error}</div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">תאריך אספקה צפוי</label>
        <input name="expectedDate" type="date" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        <p className="mt-1 text-xs text-gray-400">אפשר להשאיר ריק אם עדיין לא נקבע - יוצג &quot;טרם נקבע&quot;.</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">הערות</label>
        <textarea name="notes" rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "יוצר..." : "צור אספקה"}
    </Button>
  );
}
