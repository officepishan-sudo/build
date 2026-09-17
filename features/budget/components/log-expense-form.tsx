"use client";

import { useFormState, useFormStatus } from "react-dom";
import { logExpenseAction, type BudgetFormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const initialState: BudgetFormState = null;

export function LogExpenseForm({ projectId, lineId }: { projectId: string; lineId: string }) {
  const action = logExpenseAction.bind(null, projectId, lineId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">רישום הוצאה בפועל</h2>
      <p className="mb-3 text-xs text-gray-400">
        זו הוצאה בפועל בלבד - רישום כאן לא יוצר או משנה תשלום. תיעוד תשלום נעשה במסך התשלומים.
      </p>
      <form action={formAction} className="space-y-3">
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
            תיאור ההוצאה
          </label>
          <input
            id="description"
            name="description"
            required
            placeholder="למשל: חשבונית ספק צנרת"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="amount" className="mb-1 block text-sm font-medium text-gray-700">
            סכום
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="1"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
            תאריך (לא חובה - ברירת מחדל היום)
          </label>
          <input id="date" name="date" type="date" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
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
      {pending ? "רושם..." : "רישום הוצאה"}
    </Button>
  );
}
