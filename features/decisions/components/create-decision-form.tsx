"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createDecisionAction, type DecisionFormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const initialState: DecisionFormState = null;

export function CreateDecisionForm({ projectId }: { projectId: string }) {
  const action = createDecisionAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">פתיחת החלטה חדשה</h2>
      <form action={formAction} className="space-y-3">
        {state?.error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
        )}
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
            מה צריך להחליט?
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="למשל: איזה סוג ריצוף לבחור בסלון"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {state?.fieldErrors?.title?.[0] && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.title[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            פירוט (לא חובה)
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="deadline" className="mb-1 block text-sm font-medium text-gray-700">
              דדליין (לא חובה)
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="dependsOn" className="mb-1 block text-sm font-medium text-gray-700">
              תלוי בהחלטה/מידע אחר (לא חובה)
            </label>
            <input
              id="dependsOn"
              name="dependsOn"
              placeholder="למשל: תלוי בבחירת הקבלן"
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
    <Button type="submit" disabled={pending}>
      {pending ? "פותח..." : "פתיחת החלטה"}
    </Button>
  );
}
