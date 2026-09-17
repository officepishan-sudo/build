"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { Room } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { updateRoomAction, type InteriorFormState } from "../actions";
import { useCloseOnSuccess } from "../hooks/use-close-on-success";

const initialState: InteriorFormState = null;

export function RoomEditForm({ projectId, room, onDone }: { projectId: string; room: Room; onDone: () => void }) {
  const action = updateRoomAction.bind(null, projectId, room.id);
  const [state, formAction] = useFormState(action, initialState);
  useCloseOnSuccess(state, onDone);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
      <input
        name="name"
        required
        defaultValue={room.name}
        className="rounded-md border border-gray-300 px-2 py-1.5 text-sm font-semibold"
      />
      <input
        name="notes"
        defaultValue={room.notes ?? ""}
        placeholder="הערות"
        className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
      />
      <SubmitButton onCancel={onDone} />
    </form>
  );
}

function SubmitButton({ onCancel }: { onCancel: () => void }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex gap-2">
      <Button type="submit" disabled={pending}>
        {pending ? "שומר..." : "שמירה"}
      </Button>
      <Button type="button" variant="secondary" onClick={onCancel}>
        ביטול
      </Button>
    </div>
  );
}
