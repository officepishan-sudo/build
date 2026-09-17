"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { Document } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createDocumentAction, updateDocumentAction, type DocumentFormState } from "../actions";
import { DOCUMENT_CATEGORIES } from "../constants";

const initialState: DocumentFormState = null;

export function DocumentForm({ projectId, document }: { projectId: string; document?: Document }) {
  const action = document
    ? updateDocumentAction.bind(null, projectId, document.id)
    : createDocumentAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">{document ? "עריכת מסמך" : "הוספת מסמך"}</h2>
      <form action={formAction} className="space-y-3">
        {state?.error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">קטגוריה</label>
          <select
            name="category"
            defaultValue={document?.category ?? DOCUMENT_CATEGORIES[0]}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {DOCUMENT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">שם המסמך</label>
          <input
            name="name"
            required
            defaultValue={document?.name}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {state?.fieldErrors?.name?.[0] && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name[0]}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">קישור לקובץ (לא חובה - אפשר להשאיר ריק ולהשלים בהמשך)</label>
          <input
            name="fileUrl"
            defaultValue={document?.fileUrl}
            placeholder="https://..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            name="relatedType"
            defaultValue={document?.relatedType ?? ""}
            placeholder="קשר לפריט (לא חובה)"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            name="relatedId"
            defaultValue={document?.relatedId ?? ""}
            placeholder="מזהה/מספר (לא חובה)"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <textarea
          name="notes"
          rows={2}
          defaultValue={document?.notes ?? ""}
          placeholder="הערות (לא חובה)"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <SubmitButton isEdit={Boolean(document)} />
      </form>
    </Card>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "שומר..." : isEdit ? "שמירת שינויים" : "הוספת מסמך"}
    </Button>
  );
}
