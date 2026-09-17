"use client";

import { useFormState, useFormStatus } from "react-dom";
import { splitCartItemAction, type CartFormState } from "../actions";
import { Button } from "@/components/ui/button";

const initialState: CartFormState = null;

// טיפוס מצומצם (לא CartItem מ-@prisma/client) - קובץ 'use client' לא מייבא Prisma.
type SplittableCartItem = { id: string; quantity: unknown };

export function SplitCartItemForm({ projectId, item }: { projectId: string; item: SplittableCartItem }) {
  const [state, formAction] = useFormState(splitCartItemAction.bind(null, projectId, item.id), initialState);
  const half = Math.max(1, Math.floor(Number(item.quantity) / 2));

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{state.error}</div>
      )}
      <p className="text-sm text-gray-600">
        כמות נוכחית בשורה: <strong>{Number(item.quantity)}</strong>. הכניסו כמות לשורה חדשה - השאר יישאר בשורה המקורית.
      </p>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">כמות לפיצול</label>
        <input
          name="splitQuantity"
          type="number"
          step="0.01"
          required
          defaultValue={half}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "מפצל..." : "פצל שורה"}
    </Button>
  );
}
