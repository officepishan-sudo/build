"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createIssueAction, type IssueFormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const initialState: IssueFormState = null;

export function CreateIssueForm({ projectId }: { projectId: string }) {
  const action = createIssueAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">דיווח בעיה חדשה</h2>
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
            placeholder="למשל: עיכוב באספקת חלונות"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {state?.fieldErrors?.title?.[0] && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.title[0]}</p>}
        </div>
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            תיאור
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700">
            סוג (לא חובה)
          </label>
          <input id="type" name="type" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="dueDate" className="mb-1 block text-sm font-medium text-gray-700">
            יעד לטיפול (לא חובה)
          </label>
          <input id="dueDate" name="dueDate" type="date" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
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
      {pending ? "מדווח..." : "דיווח בעיה"}
    </Button>
  );
}
