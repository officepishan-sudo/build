"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { ContentTemplate } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { createTemplateAction, updateTemplateAction, type TemplateFormState } from "../actions";
import { TEMPLATE_PAYLOAD_HINT, TEMPLATE_TYPE_LABEL, TEMPLATE_TYPE_VALUES } from "../constants";

const initialState: TemplateFormState = null;

export function ContentForm({ template }: { template?: ContentTemplate }) {
  const action = template ? updateTemplateAction.bind(null, template.id) : createTemplateAction;
  const [state, formAction] = useFormState(action, initialState);
  const [type, setType] = useState(template?.type ?? TEMPLATE_TYPE_VALUES[0]);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <label className="block text-sm text-gray-700">
        סוג תוכן
        <select
          name="type"
          value={type}
          disabled={Boolean(template)}
          onChange={(e) => setType(e.target.value as (typeof TEMPLATE_TYPE_VALUES)[number])}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
        >
          {TEMPLATE_TYPE_VALUES.map((t) => (
            <option key={t} value={t}>
              {TEMPLATE_TYPE_LABEL[t]}
            </option>
          ))}
        </select>
        {template && <p className="mt-1 text-xs text-gray-400">אי אפשר לשנות סוג לתבנית קיימת - צרו תבנית חדשה.</p>}
      </label>
      <label className="block text-sm text-gray-700">
        מפתח (key) - ייחודי בתוך הסוג
        <input
          name="key"
          required
          defaultValue={template?.key ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        {state?.fieldErrors?.key?.[0] && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.key[0]}</p>}
      </label>
      <label className="block text-sm text-gray-700">
        תוכן (JSON)
        <textarea
          name="payloadText"
          required
          rows={8}
          dir="ltr"
          defaultValue={template ? JSON.stringify(template.payload, null, 2) : ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs"
        />
        <p className="mt-1 text-xs text-gray-400">מבנה מוצע לסוג שנבחר: {TEMPLATE_PAYLOAD_HINT[type]}</p>
        {state?.fieldErrors?.payloadText?.[0] && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.payloadText[0]}</p>
        )}
      </label>
      <SubmitButtons defaultStatus={template?.status} />
    </form>
  );
}

function SubmitButtons({ defaultStatus }: { defaultStatus?: "DRAFT" | "PUBLISHED" }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex gap-2">
      <Button type="submit" name="status" value="DRAFT" variant="secondary" disabled={pending}>
        {pending ? "שומר..." : "שמירה כטיוטה"}
      </Button>
      <Button type="submit" name="status" value="PUBLISHED" disabled={pending}>
        {pending ? "שומר..." : defaultStatus === "PUBLISHED" ? "שמירה ופרסום" : "פרסום"}
      </Button>
    </div>
  );
}
