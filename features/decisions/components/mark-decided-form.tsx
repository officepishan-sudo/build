"use client";

import { useFormState, useFormStatus } from "react-dom";
import { markDecidedAction, type DecisionFormState } from "../actions";
import { Button } from "@/components/ui/button";

const initialState: DecisionFormState = null;

export function MarkDecidedForm({ projectId, decisionId }: { projectId: string; decisionId: string }) {
  const action = markDecidedAction.bind(null, projectId, decisionId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="space-y-2">
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <label htmlFor="decidedValue" className="block text-sm font-medium text-gray-700">
        מה הוחלט? (חובה - "לא יודע" לא סוגר החלטה)
      </label>
      <textarea
        id="decidedValue"
        name="decidedValue"
        required
        rows={2}
        placeholder="למשל: נבחר ריצוף פורצלן 60x60 בגוון בז'"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      {state?.fieldErrors?.decidedValue?.[0] && (
        <p className="text-xs text-red-600">{state.fieldErrors.decidedValue[0]}</p>
      )}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "מסמן..." : "סמן כהוחלט"}
    </Button>
  );
}
