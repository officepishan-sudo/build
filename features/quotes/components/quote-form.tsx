"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { createQuoteAction, type QuoteFormState } from "../actions";
import type { ProfessionalLookup, SupplierLookup } from "@/lib/db/directory-lookups";

const initialState: QuoteFormState = null;

export function QuoteForm({
  projectId,
  professionals,
  suppliers,
  quoteRequests,
}: {
  projectId: string;
  professionals: ProfessionalLookup[];
  suppliers: SupplierLookup[];
  quoteRequests: { id: string; title: string }[];
}) {
  const [state, formAction] = useFormState(createQuoteAction.bind(null, projectId), initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4 text-right">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      <div>
        <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
          מחיר ההצעה (₪)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SelectField label="בעל מקצוע (אם רלוונטי)" name="professionalId" options={professionals} />
        <SelectField label="ספק (אם רלוונטי)" name="supplierId" options={suppliers} />
      </div>
      <p className="text-xs text-gray-400">יש לבחור לפחות אחד מהשניים - מי שהגיש את ההצעה.</p>

      {quoteRequests.length > 0 && (
        <SelectField
          label="שייכת לבקשת הצעה (לא חובה)"
          name="quoteRequestId"
          options={quoteRequests.map((qr) => ({ id: qr.id, name: qr.title }))}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <TextField label="משך ביצוע (ימים)" name="durationDays" type="number" />
        <TextField label="תנאי תשלום" name="paymentTerms" />
      </div>

      <TextField label="אחריות" name="warrantyText" />
      <TextArea label="כלול / לא כלול" name="includesNotes" />
      <TextArea label="הערות נוספות" name="notes" />

      <SubmitButton />
    </form>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: { id: string; name: string }[] }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select id={name} name={name} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
        <option value="">ללא</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input id={name} name={name} type={type} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
    </div>
  );
}

function TextArea({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea id={name} name={name} rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "מוסיף..." : "הוספת הצעה שהתקבלה"}
    </Button>
  );
}
