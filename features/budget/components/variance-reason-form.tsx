"use client";

import { useFormState, useFormStatus } from "react-dom";
import { setVarianceReasonAction, type BudgetFormState } from "../actions";
import { Button } from "@/components/ui/button";

const initialState: BudgetFormState = null;

// ספק 8.2: פער לא מוסבר לא מוסתר - מציגים טופס מפורש שמבקש varianceReason
// במקום להשאיר מספר אדום בלי הקשר.
export function VarianceReasonForm({ projectId, lineId }: { projectId: string; lineId: string }) {
  const action = setVarianceReasonAction.bind(null, projectId, lineId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="mt-2 space-y-2 rounded-md border border-amber-200 bg-amber-50 p-3">
      <p className="text-sm font-medium text-amber-800">יש חריגה מהתכנון בקטגוריה הזו - מה הסיבה?</p>
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
      <textarea
        name="varianceReason"
        required
        rows={2}
        placeholder="למשל: עליית מחירי חומרי גלם, תוספת שלא הייתה מתוכננת"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" disabled={pending}>
      {pending ? "שומר..." : "שמירת הסבר לפער"}
    </Button>
  );
}
