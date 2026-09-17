"use client";

import { useFormState, useFormStatus } from "react-dom";
import { registerAction, type AuthFormState } from "../actions";
import { Button } from "@/components/ui/button";

const initialState: AuthFormState = null;

export function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}
      <Field name="name" label="שם מלא" type="text" error={state?.fieldErrors?.name} />
      <Field name="email" label="אימייל" type="email" error={state?.fieldErrors?.email} />
      <Field name="phone" label="טלפון (לא חובה)" type="tel" required={false} />
      <Field name="password" label="סיסמה (8 תווים לפחות)" type="password" error={state?.fieldErrors?.password} />
      <SubmitButton />
    </form>
  );
}

function Field({
  name,
  label,
  type,
  required = true,
  error,
}: {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  error?: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      {error?.[0] && <p className="mt-1 text-xs text-red-600">{error[0]}</p>}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "יוצר חשבון..." : "יצירת חשבון"}
    </Button>
  );
}
