"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import type { SupplierFormState } from "../actions";
import { SUPPLIER_CATEGORY_SUGGESTIONS } from "../constants";

type Action = (prevState: SupplierFormState, formData: FormData) => Promise<SupplierFormState>;
// שדות בלבד (בלי import type מ-@prisma/client) - נמנעים מייבוא Prisma ברכיב 'use client'.
type SupplierFormValues = { name: string; categories: string[]; area: string | null; terms: string | null; warrantyPolicy: string | null };

// טופס משותף ליצירה ולעריכה של ספק - ה-action וברירות המחדל מגיעות מהקורא.
export function SupplierForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: Action;
  defaultValues?: SupplierFormValues;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, null);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          שם הספק
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <fieldset>
        <legend className="mb-1 text-sm font-medium text-gray-700">קטגוריות</legend>
        <div className="flex flex-wrap gap-3">
          {SUPPLIER_CATEGORY_SUGGESTIONS.map((c) => (
            <label key={c} className="flex items-center gap-1 text-sm text-gray-600">
              <input
                type="checkbox"
                name="categories"
                value={c}
                defaultChecked={defaultValues?.categories.includes(c)}
                className="h-4 w-4"
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="area" className="mb-1 block text-sm font-medium text-gray-700">
          אזור (לא חובה)
        </label>
        <input
          id="area"
          name="area"
          defaultValue={defaultValues?.area ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="terms" className="mb-1 block text-sm font-medium text-gray-700">
          תנאי עבודה (לא חובה)
        </label>
        <textarea
          id="terms"
          name="terms"
          rows={2}
          defaultValue={defaultValues?.terms ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="warrantyPolicy" className="mb-1 block text-sm font-medium text-gray-700">
          מדיניות אחריות (לא חובה)
        </label>
        <textarea
          id="warrantyPolicy"
          name="warrantyPolicy"
          rows={2}
          defaultValue={defaultValues?.warrantyPolicy ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "שומר..." : label}
    </Button>
  );
}
