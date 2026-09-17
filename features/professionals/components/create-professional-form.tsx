"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { createProfessionalAction, type ProfessionalFormState } from "../actions";
import { PROFESSIONAL_FIELD_OPTIONS } from "../constants";

const initialState: ProfessionalFormState = null;

export function CreateProfessionalForm() {
  const [state, formAction] = useFormState(createProfessionalAction, initialState);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          שם בעל המקצוע
        </label>
        <input id="name" name="name" required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <fieldset>
        <legend className="mb-1 text-sm font-medium text-gray-700">תחומים</legend>
        <div className="flex flex-wrap gap-3">
          {PROFESSIONAL_FIELD_OPTIONS.map((f) => (
            <label key={f} className="flex items-center gap-1 text-sm text-gray-600">
              <input type="checkbox" name="fields" value={f} className="h-4 w-4" />
              {f}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="area" className="mb-1 block text-sm font-medium text-gray-700">
          אזור פעילות
        </label>
        <input id="area" name="area" required className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="experienceYears" className="mb-1 block text-sm font-medium text-gray-700">
            שנות ניסיון
          </label>
          <input
            id="experienceYears"
            name="experienceYears"
            type="number"
            min={0}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="responseTimeHours" className="mb-1 block text-sm font-medium text-gray-700">
            זמן תגובה ממוצע (שעות)
          </label>
          <input
            id="responseTimeHours"
            name="responseTimeHours"
            type="number"
            min={1}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="mb-1 block text-sm font-medium text-gray-700">
          תיאור קצר (לא חובה)
        </label>
        <textarea id="bio" name="bio" rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "מוסיף..." : "הוספת בעל מקצוע"}
    </Button>
  );
}
