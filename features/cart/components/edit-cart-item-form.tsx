"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateCartItemAction, type CartFormState } from "../actions";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@prisma/client";

const initialState: CartFormState = null;

export function EditCartItemForm({
  projectId,
  item,
  suppliers,
  phases,
}: {
  projectId: string;
  item: CartItem;
  suppliers: { id: string; name: string }[];
  phases: { id: string; name: string }[];
}) {
  const [state, formAction] = useFormState(updateCartItemAction.bind(null, projectId, item.id), initialState);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{state.error}</div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">כמות</label>
        <input
          name="quantity"
          type="number"
          step="0.01"
          required
          defaultValue={Number(item.quantity)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">מחיר יח&apos;</label>
        <input
          name="unitPrice"
          type="number"
          step="0.01"
          defaultValue={item.unitPrice ? Number(item.unitPrice) : undefined}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">ספק</label>
        <select name="supplierId" defaultValue={item.supplierId ?? ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">לא נבחר</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">שלב</label>
        <select name="phaseId" defaultValue={item.phaseId ?? ""} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">לא נבחר</option>
          {phases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "שומר..." : "שמור שינויים"}
    </Button>
  );
}
