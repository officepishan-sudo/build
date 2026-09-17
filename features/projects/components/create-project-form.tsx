"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createProjectAction, type ProjectFormState } from "../actions";
import { Button } from "@/components/ui/button";
import { PROJECT_TYPE_LABEL } from "../constants";

const initialState: ProjectFormState = null;

export function CreateProjectForm({ existing, quotesOnly }: { existing: boolean; quotesOnly: boolean }) {
  const [state, formAction] = useFormState(createProjectAction, initialState);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}
      <input type="hidden" name="isExistingProject" value={existing ? "on" : ""} />
      <input type="hidden" name="track" value={quotesOnly ? "QUOTES_ONLY" : "FULL"} />

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          שם הפרויקט
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="למשל: שיפוץ בית ברחוב הדובדבן"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        {state?.fieldErrors?.name?.[0] && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700">
          סוג הפרויקט
        </label>
        <select id="type" name="type" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          {Object.entries(PROJECT_TYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-400">לא בטוחים? אפשר לבחור &quot;אחר&quot; ולהמשיך - זה לא סופי.</p>
      </div>

      <div>
        <label htmlFor="scopeDescription" className="mb-1 block text-sm font-medium text-gray-700">
          תיאור קצר (לא חובה)
        </label>
        <textarea
          id="scopeDescription"
          name="scopeDescription"
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <input id="startDateKnown" name="startDateKnown" type="checkbox" className="h-4 w-4" />
        <label htmlFor="startDateKnown" className="text-sm text-gray-700">
          יש לי תאריך התחלה משוער
        </label>
      </div>

      <div>
        <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-gray-700">
          תאריך התחלה (אם ידוע)
        </label>
        <input id="startDate" name="startDate" type="date" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <SubmitButton existing={existing} />
    </form>
  );
}

function SubmitButton({ existing }: { existing: boolean }) {
  const { pending } = useFormStatus();
  const label = pending ? "יוצר..." : nextStepLabel(existing);
  return (
    <Button type="submit" disabled={pending}>
      {label}
    </Button>
  );
}

function nextStepLabel(existing: boolean): string {
  if (existing) return "המשך לקליטת המצב הקיים";
  return "המשך לשאלון";
}
