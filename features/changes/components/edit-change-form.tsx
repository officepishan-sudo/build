"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { ChangeRequest } from "@prisma/client";
import { updateChangeRequestAction, type ChangeFormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const initialState: ChangeFormState = null;

export function EditChangeForm({ projectId, change }: { projectId: string; change: ChangeRequest }) {
  const action = updateChangeRequestAction.bind(null, projectId, change.id);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">עריכת פרטי השינוי</h2>
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
            defaultValue={change.title}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
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
            defaultValue={change.reason}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="priceImpact" className="mb-1 block text-sm font-medium text-gray-700">
              השפעה על המחיר
            </label>
            <input
              id="priceImpact"
              name="priceImpact"
              type="number"
              defaultValue={change.priceImpact ? Number(change.priceImpact) : undefined}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="scheduleImpactDays" className="mb-1 block text-sm font-medium text-gray-700">
              השפעה על לו&quot;ז (ימים)
            </label>
            <input
              id="scheduleImpactDays"
              name="scheduleImpactDays"
              type="number"
              defaultValue={change.scheduleImpactDays ?? undefined}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <SubmitButton />
      </form>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" disabled={pending}>
      {pending ? "שומר..." : "שמירת שינויים"}
    </Button>
  );
}
