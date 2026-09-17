"use client";

import { useFormState, useFormStatus } from "react-dom";
import { approveChangeAction, type ApproveChangeState } from "../actions";
import { Button } from "@/components/ui/button";
import type { ChangeImpactQueryInput } from "../schema";

const initialState: ApproveChangeState = null;

export function ApproveForm({
  projectId,
  query,
  returnTo,
}: {
  projectId: string;
  query: ChangeImpactQueryInput;
  returnTo?: string;
}) {
  const action = approveChangeAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="mt-6 max-w-xl rounded-lg border border-gray-200 bg-white p-4">
      <input type="hidden" name="changeDescription" value={query.changeDescription} />
      <input type="hidden" name="affectedRequirementIds" value={query.affectedRequirementIds.join(",")} />
      <input type="hidden" name="affectedQuoteIds" value={query.affectedQuoteIds.join(",")} />
      <input type="hidden" name="affectedOrderIds" value={query.affectedOrderIds.join(",")} />
      <input type="hidden" name="affectedQuantityItemIds" value={query.affectedQuantityItemIds.join(",")} />
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}

      {state?.error && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      )}

      <label htmlFor="reason" className="mb-1 block text-sm font-medium text-gray-700">
        סיבת האישור
      </label>
      <textarea
        id="reason"
        name="reason"
        required
        rows={2}
        placeholder="למה מאשרים את השינוי הזה עכשיו"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <p className="mt-1 text-xs text-gray-400">האישור נשמר תמיד עם תיעוד לפני/אחרי, כדי שאפשר יהיה לחזור ולבדוק מי אישר ולמה.</p>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="mt-3">
      {pending ? "מאשר..." : "אשר שינוי"}
    </Button>
  );
}
