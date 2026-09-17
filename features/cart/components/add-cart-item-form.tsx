"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addCartItemAction, type CartFormState } from "../actions";
import { Button } from "@/components/ui/button";

const initialState: CartFormState = null;

export function AddCartItemForm({
  projectId,
  suppliers,
  phases,
}: {
  projectId: string;
  suppliers: { id: string; name: string }[];
  phases: { id: string; name: string }[];
}) {
  const [state, formAction] = useFormState(addCartItemAction.bind(null, projectId), initialState);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:items-end">
      {state?.error && (
        <div className="sm:col-span-5 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <div className="sm:col-span-2">
        <label className="mb-1 block text-xs font-medium text-gray-700">תיאור הפריט</label>
        <input name="description" required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">כמות</label>
        <input name="quantity" type="number" step="0.01" required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">מחיר יח&apos;</label>
        <input name="unitPrice" type="number" step="0.01" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">ספק</label>
        <select name="supplierId" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">לא נבחר</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">שלב</label>
        <select name="phaseId" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
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
    <Button type="submit" disabled={pending} className="sm:col-span-5 sm:w-fit">
      {pending ? "מוסיף..." : "הוסף לעגלה"}
    </Button>
  );
}
