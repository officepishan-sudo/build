"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createMaintenanceItemAction, type WarrantyFormState } from "../actions";
import { Button } from "@/components/ui/button";

const initialState: WarrantyFormState = null;

export function CreateMaintenanceForm({
  projectId,
  warranties,
}: {
  projectId: string;
  warranties: { id: string; label: string }[];
}) {
  const action = createMaintenanceItemAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
      {state?.error && <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>}
      <label className="text-sm text-gray-700 sm:col-span-2">
        כותרת התחזוקה
        <input
          name="title"
          required
          placeholder="למשל: ניקוי מסנני מזגן"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="text-sm text-gray-700">
        תדירות (לא חובה)
        <input
          name="frequency"
          placeholder="למשל: כל חצי שנה"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="text-sm text-gray-700">
        תאריך יעד הבא (לא חובה)
        <input name="nextDueDate" type="date" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </label>
      <label className="text-sm text-gray-700 sm:col-span-2">
        קשור לאחריות (לא חובה)
        <select name="warrantyId" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">ללא קישור</option>
          {warranties.map((w) => (
            <option key={w.id} value={w.id}>
              {w.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-gray-700 sm:col-span-2">
        הערות (לא חובה)
        <textarea name="notes" rows={2} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </label>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="sm:col-span-2">
      {pending ? "מוסיף..." : "הוספת תזכורת"}
    </Button>
  );
}
