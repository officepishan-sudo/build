"use client";

import type { ReactNode } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createOrdersFromCartAction, type OrderFormState } from "../actions";
import { Button } from "@/components/ui/button";

const initialState: OrderFormState = null;

export function CreateOrderForm({ projectId, children }: { projectId: string; children: ReactNode }) {
  const [state, formAction] = useFormState(createOrdersFromCartAction.bind(null, projectId), initialState);

  return (
    <form action={formAction}>
      {state?.error && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}
      {children}
      <div className="mt-4">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "יוצר הזמנה..." : "צור הזמנה מהפריטים המסומנים"}
    </Button>
  );
}
