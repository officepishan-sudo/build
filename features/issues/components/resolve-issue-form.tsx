"use client";

import { useFormState, useFormStatus } from "react-dom";
import { closeIssueAction, resolveIssueAction, type IssueFormState } from "../actions";
import { Button } from "@/components/ui/button";

const initialState: IssueFormState = null;

// "לא להפוך הצעה לא-מאושרת לפתרון מאושר" - חובה הערת פתרון מפורשת, אין
// כפתור שמסמן RESOLVED/CLOSED בלי טקסט.
export function ResolveIssueForm({
  projectId,
  id,
  mode,
}: {
  projectId: string;
  id: string;
  mode: "resolve" | "close";
}) {
  const action = (mode === "resolve" ? resolveIssueAction : closeIssueAction).bind(null, projectId, id);
  const [state, formAction] = useFormState(action, initialState);
  const title = mode === "resolve" ? "מה הפתרון?" : "אישור סגירה - מה אושר?";

  return (
    <form action={formAction} className="space-y-2 rounded-md border border-gray-200 bg-gray-50 p-3">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
      <textarea
        name="resolutionNote"
        required
        rows={2}
        placeholder={mode === "resolve" ? "למשל: תוקן ע\"י הקבלן, נבדק בשטח" : "למשל: אושר ע\"י המפקח לאחר בדיקה חוזרת"}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <SubmitButton mode={mode} />
    </form>
  );
}

function SubmitButton({ mode }: { mode: "resolve" | "close" }) {
  const { pending } = useFormStatus();
  const label = mode === "resolve" ? "סמן כנפתרה" : "אשר סגירה";
  return (
    <Button type="submit" variant={mode === "resolve" ? "primary" : "secondary"} disabled={pending}>
      {pending ? "שומר..." : label}
    </Button>
  );
}
