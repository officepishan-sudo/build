"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inviteShareAction, type ShareFormState } from "../actions";
import { ASSIGNABLE_SHARE_LEVELS, SHARE_LEVEL_LABEL } from "../constants";

const initialState: ShareFormState = null;

export function InviteShareForm({ projectId }: { projectId: string }) {
  const action = inviteShareAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">הוספת שיתוף</h2>
      <form action={formAction} className="space-y-3">
        {state?.error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
        )}
        {state?.info && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{state.info}</div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">אימייל</label>
          <input
            name="email"
            type="email"
            required
            placeholder="name@example.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">רמת גישה</label>
          <select name="level" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            {ASSIGNABLE_SHARE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {SHARE_LEVEL_LABEL[level]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">תחום (ל"ניהול" בלבד, לא חובה)</label>
          <input
            name="domain"
            placeholder="למשל: budget"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <SubmitButton />
      </form>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "משתף..." : "שיתוף"}
    </Button>
  );
}
