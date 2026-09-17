"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { CanvasElement } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { createPinAction, deletePinAction, updatePinAction, type CanvasFormState } from "../actions";

const initialState: CanvasFormState = null;

/** טופס יצירה/עריכה של פין בודד - משמש גם בלוח החזותי וגם ברשימה (בלי תמונה). */
export function PinForm({
  projectId,
  requirements,
  pin,
  coords,
  onDone,
}: {
  projectId: string;
  requirements: { id: string; label: string }[];
  pin?: CanvasElement;
  coords?: { x: number; y: number };
  onDone?: () => void;
}) {
  const action = pin ? updatePinAction.bind(null, projectId, pin.id) : createPinAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);
  const position = pin ? { x: pin.x, y: pin.y } : coords ?? { x: 50, y: 50 };

  useEffect(() => {
    if (state?.ok) onDone?.();
  }, [state, onDone]);

  return (
    <form action={formAction} className="space-y-2 rounded-md border border-gray-200 bg-white p-3 shadow-md">
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <input type="hidden" name="x" value={position.x} />
      <input type="hidden" name="y" value={position.y} />
      <label className="block text-sm text-gray-700">
        תווית
        <input
          name="label"
          required
          defaultValue={pin?.label ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
      </label>
      <label className="block text-sm text-gray-700">
        הערה (לא חובה)
        <textarea
          name="note"
          rows={2}
          defaultValue={pin?.note ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
      </label>
      <label className="block text-sm text-gray-700">
        קישור לדרישה (לא חובה)
        <select
          name="linkedRequirementId"
          defaultValue={pin?.linkedRequirementId ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        >
          <option value="">ללא קישור</option>
          {requirements.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </label>
      <FormActions pin={pin} projectId={projectId} onDone={onDone} />
    </form>
  );
}

function FormActions({
  pin,
  projectId,
  onDone,
}: {
  pin?: CanvasElement;
  projectId: string;
  onDone?: () => void;
}) {
  const { pending } = useFormStatus();
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <Button type="submit" disabled={pending}>
        {pending ? "שומר..." : "שמירה"}
      </Button>
      {onDone && (
        <Button type="button" variant="secondary" onClick={onDone}>
          ביטול
        </Button>
      )}
      {pin && (
        <form
          action={deletePinAction.bind(null, projectId, pin.id)}
          onSubmit={(e) => {
            if (!window.confirm("למחוק את הפין? הפעולה בלתי הפיכה.")) e.preventDefault();
          }}
        >
          <Button type="submit" variant="danger">
            מחיקה
          </Button>
        </form>
      )}
    </div>
  );
}
