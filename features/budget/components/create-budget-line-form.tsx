"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createBudgetLineAction, type BudgetFormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const initialState: BudgetFormState = null;

export function CreateBudgetLineForm({ projectId }: { projectId: string }) {
  const action = createBudgetLineAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">קטגוריית תקציב חדשה</h2>
      <form action={formAction} className="space-y-3">
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
            קטגוריה
          </label>
          <input
            id="category"
            name="category"
            required
            placeholder="למשל: אינסטלציה"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {state?.fieldErrors?.category?.[0] && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.category[0]}</p>}
        </div>
        <div>
          <label htmlFor="plannedAmount" className="mb-1 block text-sm font-medium text-gray-700">
            סכום מתוכנן (אומדן)
          </label>
          <input
            id="plannedAmount"
            name="plannedAmount"
            type="number"
            min="0"
            step="1"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="committedAmount" className="mb-1 block text-sm font-medium text-gray-700">
            התחייבויות ידועות (לא חובה)
          </label>
          <input
            id="committedAmount"
            name="committedAmount"
            type="number"
            min="0"
            step="1"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-gray-400">
            הזנה ידנית - המערכת עדיין לא מקשרת הזמנות לקטגוריית תקציב באופן אוטומטי.
          </p>
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
      {pending ? "יוצר..." : "הוספת קטגוריה"}
    </Button>
  );
}
