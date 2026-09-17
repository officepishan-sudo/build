"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { RecipientChecklist } from "./recipient-checklist";
import { submitQuoteRequestAction, type QuoteRequestFormState } from "../actions";
import type { ProfessionalLookup, SupplierLookup } from "@/lib/db/directory-lookups";

const initialState: QuoteRequestFormState = null;

export function QuoteRequestForm({
  projectId,
  professionals,
  suppliers,
}: {
  projectId: string;
  professionals: ProfessionalLookup[];
  suppliers: SupplierLookup[];
}) {
  const [state, formAction] = useFormState(submitQuoteRequestAction.bind(null, projectId), initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
          כותרת הבקשה
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="למשל: הצעת מחיר לעבודות אינסטלציה"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="scopeText" className="mb-1 block text-sm font-medium text-gray-700">
          סעיפים, כמויות ומפרט
        </label>
        <textarea
          id="scopeText"
          name="scopeText"
          rows={6}
          placeholder={"כתבו כל סעיף בשורה נפרדת, למשל:\n1. החלפת צנרת מטבח - 8 מטר\n2. התקנת ברז מטבח - יחידה אחת"}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="deadline" className="mb-1 block text-sm font-medium text-gray-700">
          דדליין למענה (לא חובה)
        </label>
        <input id="deadline" name="deadline" type="date" className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
      </div>

      <RecipientChecklist professionals={professionals} suppliers={suppliers} />

      <div className="flex gap-3">
        <SubmitButton intent="draft" label="שמירה כטיוטה" variant="secondary" />
        <SubmitButton intent="send" label="שליחה" variant="primary" />
      </div>
    </form>
  );
}

function SubmitButton({
  intent,
  label,
  variant,
}: {
  intent: "draft" | "send";
  label: string;
  variant: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" name="intent" value={intent} variant={variant} disabled={pending}>
      {pending ? "שולח..." : label}
    </Button>
  );
}
