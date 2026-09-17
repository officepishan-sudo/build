"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createChangeRequestAction, type ChangeFormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const initialState: ChangeFormState = null;

export function CreateChangeForm({ projectId }: { projectId: string }) {
  const action = createChangeRequestAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">שינוי / תוספת חדשה</h2>
      <form action={formAction} className="space-y-3">
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
            כותרת
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="למשל: הוספת חלון בחדר השינה"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {state?.fieldErrors?.title?.[0] && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.title[0]}</p>}
        </div>
        <div>
          <label htmlFor="reason" className="mb-1 block text-sm font-medium text-gray-700">
            סיבה
          </label>
          <textarea
            id="reason"
            name="reason"
            required
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {state?.fieldErrors?.reason?.[0] && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.reason[0]}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="priceImpact" className="mb-1 block text-sm font-medium text-gray-700">
              השפעה על המחיר (לא חובה)
            </label>
            <input id="priceImpact" name="priceImpact" type="number" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="scheduleImpactDays" className="mb-1 block text-sm font-medium text-gray-700">
              השפעה על לוח הזמנים (ימים)
            </label>
            <input
              id="scheduleImpactDays"
              name="scheduleImpactDays"
              type="number"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400">השינוי נפתח כטיוטה - אין חובה לדעת עדיין את כל הפרטים.</p>
        <SubmitButton />
      </form>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "פותח..." : "פתיחת שינוי"}
    </Button>
  );
}
