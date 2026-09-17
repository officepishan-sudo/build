"use client";

import { useFormState, useFormStatus } from "react-dom";
import { closeDefectAction, resolveDefectAction, type DefectFormState } from "../actions";
import { Button } from "@/components/ui/button";

const initialState: DefectFormState = null;

// "נפתר אינו נסגר" - שני מצבים נפרדים לגמרי, כל אחד עם טופס והערה משלו.
export function DefectNoteForm({ projectId, id, mode }: { projectId: string; id: string; mode: "resolve" | "close" }) {
  const fieldName = mode === "resolve" ? "resolutionNotes" : "closingNote";
  const action = (mode === "resolve" ? resolveDefectAction : closeDefectAction).bind(null, projectId, id);
  const [state, formAction] = useFormState(action, initialState);
  const title = mode === "resolve" ? "מה תוקן?" : "אישור סגירה - מי בדק ואישר?";

  return (
    <form action={formAction} className="space-y-2 rounded-md border border-gray-200 bg-gray-50 p-3">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
      <textarea
        name={fieldName}
        required
        rows={2}
        placeholder={mode === "resolve" ? "למשל: הוחלף האריח הסדוק" : "למשל: נבדק ואושר ע\"י המפקח בסיור מסירה"}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <SubmitButton mode={mode} />
    </form>
  );
}

function SubmitButton({ mode }: { mode: "resolve" | "close" }) {
  const { pending } = useFormStatus();
  const label = mode === "resolve" ? 'סמן "נפתר"' : "אשר סגירה";
  return (
    <Button type="submit" variant={mode === "resolve" ? "primary" : "secondary"} disabled={pending}>
      {pending ? "שומר..." : label}
    </Button>
  );
}
