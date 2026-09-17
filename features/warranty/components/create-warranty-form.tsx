"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createWarrantyAction, type WarrantyFormState } from "../actions";
import { Button } from "@/components/ui/button";

const initialState: WarrantyFormState = null;

export function CreateWarrantyForm({
  projectId,
  suppliers,
  professionals,
}: {
  projectId: string;
  suppliers: { id: string; name: string }[];
  professionals: { id: string; name: string }[];
}) {
  const action = createWarrantyAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
      {state?.error && <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>}
      <label className="text-sm text-gray-700 sm:col-span-2">
        תיאור הפריט
        <input
          name="itemDescription"
          required
          placeholder="למשל: דוד שמש, ריצוף סלון"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="text-sm text-gray-700">
        ספק (לא חובה)
        <select name="supplierId" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">ללא</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-gray-700">
        בעל מקצוע (לא חובה)
        <select name="professionalId" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">ללא</option>
          {professionals.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-gray-700">
        תאריך התחלת אחריות
        <input
          name="startDate"
          type="date"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="text-sm text-gray-700">
        משך האחריות (חודשים)
        <input
          name="durationMonths"
          type="number"
          min={1}
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </label>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="sm:col-span-2">
      {pending ? "מוסיף..." : "הוספת אחריות"}
    </Button>
  );
}
