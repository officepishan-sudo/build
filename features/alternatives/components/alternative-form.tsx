"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createAlternativeAction, type AlternativeFormState } from "../actions";
import { Button } from "@/components/ui/button";

const initialState: AlternativeFormState = null;

export function AlternativeForm({ projectId }: { projectId: string }) {
  const action = createAlternativeAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="max-w-lg space-y-3">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}
      <Field label="כותרת" name="title" fieldErrors={state?.fieldErrors} required />
      <Field label="תיאור" name="description" as="textarea" fieldErrors={state?.fieldErrors} required />
      <div className="grid grid-cols-2 gap-3">
        <Field label="מחיר מינימלי (₪)" name="priceMin" type="number" fieldErrors={state?.fieldErrors} />
        <Field label="מחיר מקסימלי (₪)" name="priceMax" type="number" fieldErrors={state?.fieldErrors} />
      </div>
      <Field label="משך משוער (ימים)" name="durationDays" type="number" fieldErrors={state?.fieldErrors} />
      <Field label="יתרונות (שורה לכל יתרון)" name="prosText" as="textarea" fieldErrors={state?.fieldErrors} />
      <Field label="חסרונות (שורה לכל חסרון)" name="consText" as="textarea" fieldErrors={state?.fieldErrors} />
      <Field label="הערות תחזוקה" name="maintenanceNotes" as="textarea" fieldErrors={state?.fieldErrors} />
      <Field label="חומרים" name="materialsNotes" as="textarea" fieldErrors={state?.fieldErrors} />
      <Field label="קישור לתמונה (לא חובה)" name="imageUrl" fieldErrors={state?.fieldErrors} />
      <Field
        label='למה מוצגת החלופה הזו ("why you see this")'
        name="reasonShown"
        as="textarea"
        fieldErrors={state?.fieldErrors}
        required
      />
      <SubmitButton />
    </form>
  );
}

function Field({
  label,
  name,
  as = "input",
  type = "text",
  required = false,
  fieldErrors,
}: {
  label: string;
  name: string;
  as?: "input" | "textarea";
  type?: string;
  required?: boolean;
  fieldErrors?: Record<string, string[]>;
}) {
  const error = fieldErrors?.[name]?.[0];
  const className = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm";
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea id={name} name={name} rows={2} required={required} className={className} />
      ) : (
        <input id={name} name={name} type={type} required={required} className={className} />
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "שומר..." : "הוספת חלופה"}
    </Button>
  );
}
