"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { Photo } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { addPhotoAction, editPhotoAction, type PhotoFormState } from "../actions";

type PhaseOption = { id: string; name: string };

const initialState: PhotoFormState = null;

export function PhotoForm({
  projectId,
  phases,
  photo,
}: {
  projectId: string;
  phases: PhaseOption[];
  photo?: Photo;
}) {
  const action = photo ? editPhotoAction.bind(null, projectId, photo.id) : addPhotoAction.bind(null, projectId);
  const [state, formAction] = useFormState(action, initialState);
  const takenAtValue = photo ? new Date(photo.takenAt).toISOString().slice(0, 10) : undefined;

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">{photo ? "עריכת תמונה" : "הוספת תמונה"}</h2>
      <form action={formAction} className="space-y-3">
        {state?.error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">קישור לתמונה</label>
          <input
            name="url"
            required
            defaultValue={photo?.url}
            placeholder="https://..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">תאריך צילום</label>
            <input
              name="takenAt"
              type="date"
              defaultValue={takenAtValue}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">שלב</label>
            <select
              name="phaseId"
              defaultValue={photo?.phaseId ?? ""}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">— ללא שלב —</option>
              {phases.map((phase) => (
                <option key={phase.id} value={phase.id}>
                  {phase.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <textarea
          name="caption"
          rows={2}
          defaultValue={photo?.caption ?? ""}
          placeholder="הערה (לא חובה)"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="isBeforeAfter" defaultChecked={photo?.isBeforeAfter} />
          תמונת "לפני/אחרי"
        </label>
        <SubmitButton isEdit={Boolean(photo)} />
      </form>
    </Card>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "שומר..." : isEdit ? "שמירת שינויים" : "הוספת תמונה"}
    </Button>
  );
}
