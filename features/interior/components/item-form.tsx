"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { InteriorItem } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { createItemAction, updateItemAction, type InteriorFormState } from "../actions";
import { INTERIOR_CATEGORY_OPTIONS } from "../constants";
import { useCloseOnSuccess } from "../hooks/use-close-on-success";

const initialState: InteriorFormState = null;

export function ItemForm({
  projectId,
  roomId,
  item,
  onDone,
}: {
  projectId: string;
  roomId: string;
  item?: InteriorItem;
  onDone?: () => void;
}) {
  const action = item
    ? updateItemAction.bind(null, projectId, roomId, item.id)
    : createItemAction.bind(null, projectId, roomId);
  const [state, formAction] = useFormState(action, initialState);
  useCloseOnSuccess(state, onDone);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2 rounded-md border border-gray-200 bg-gray-50 p-3">
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
      <label className="text-sm text-gray-700">
        קטגוריה
        <input
          name="category"
          required
          list="interior-categories"
          defaultValue={item?.category ?? ""}
          className="mt-1 w-32 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
        <datalist id="interior-categories">
          {INTERIOR_CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>
      <label className="flex-1 text-sm text-gray-700">
        החלטה/תיאור
        <input
          name="decisionText"
          defaultValue={item?.decisionText ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
      </label>
      <label className="text-sm text-gray-700">
        כמות
        <input
          name="quantity"
          type="number"
          step="0.01"
          defaultValue={item?.quantity ? Number(item.quantity) : undefined}
          className="mt-1 w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
      </label>
      <SubmitButton onCancel={onDone} />
    </form>
  );
}

function SubmitButton({ onCancel }: { onCancel?: () => void }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex gap-2">
      <Button type="submit" disabled={pending}>
        {pending ? "שומר..." : "שמירה"}
      </Button>
      {onCancel && (
        <Button type="button" variant="secondary" onClick={onCancel}>
          ביטול
        </Button>
      )}
    </div>
  );
}
