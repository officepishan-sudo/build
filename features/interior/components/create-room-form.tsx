"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createRoomAction, type InteriorFormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const initialState: InteriorFormState = null;

export function CreateRoomForm({ projectId }: { projectId: string }) {
  const action = createRoomAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);

  return (
    <Card>
      <h2 className="mb-2 text-sm font-semibold text-gray-700">הוספת חדר</h2>
      <p className="mb-3 text-sm text-gray-500">
        מודול תכנון הפנים אופציונלי - אין צורך בו בפרויקטים שלא כוללים חדרי מגורים (למשל גדר או חניה).
      </p>
      <form action={formAction} className="flex flex-wrap items-end gap-3">
        {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
        <label className="text-sm text-gray-700">
          שם החדר
          <input
            name="name"
            required
            placeholder="למשל: סלון"
            className="mt-1 w-48 rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex-1 text-sm text-gray-700">
          הערות (לא חובה)
          <input name="notes" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <SubmitButton />
      </form>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "מוסיף..." : "הוספת חדר"}
    </Button>
  );
}
