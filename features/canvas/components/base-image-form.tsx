"use client";

import { useFormState, useFormStatus } from "react-dom";
import { setBaseImageAction, type CanvasFormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const initialState: CanvasFormState = null;

export function BaseImageForm({ projectId, currentUrl }: { projectId: string; currentUrl?: string | null }) {
  const action = setBaseImageAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card>
      <h2 className="mb-2 text-sm font-semibold text-gray-700">
        {currentUrl ? "החלפת תמונת הבסיס" : "הוספת תמונת בסיס לקנבס"}
      </h2>
      <p className="mb-3 text-sm text-gray-500">
        הדביקו כתובת URL לתמונה או לשרטוט של הפרויקט. אין העלאת קבצים במערכת - רק קישור.
      </p>
      <form action={formAction} className="flex flex-wrap items-end gap-3">
        {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
        <label htmlFor="imageUrl" className="flex-1 text-sm text-gray-700">
          כתובת התמונה
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            required
            defaultValue={currentUrl ?? ""}
            placeholder="https://..."
            className="mt-1 w-full min-w-[240px] rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <SubmitButton hasImage={Boolean(currentUrl)} />
      </form>
    </Card>
  );
}

function SubmitButton({ hasImage }: { hasImage: boolean }) {
  const { pending } = useFormStatus();
  const idleLabel = hasImage ? "עדכון תמונה" : "הוספת תמונה";
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "שומר..." : idleLabel}
    </Button>
  );
}
