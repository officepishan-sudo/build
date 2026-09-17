"use client";

import { useState } from "react";
import type { Room } from "@prisma/client";
import { deleteRoomAction } from "../actions";
import { RoomEditForm } from "./room-edit-form";

export function RoomHeader({ projectId, room }: { projectId: string; room: Room }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <RoomEditForm projectId={projectId} room={room} onDone={() => setEditing(false)} />;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h3 className="text-base font-semibold text-gray-900">{room.name}</h3>
        {room.notes && <p className="text-sm text-gray-500">{room.notes}</p>}
      </div>
      <div className="flex gap-3 text-xs">
        <button type="button" onClick={() => setEditing(true)} className="text-brand-700 hover:underline">
          עריכה
        </button>
        <form
          action={deleteRoomAction.bind(null, projectId, room.id)}
          onSubmit={(e) => {
            if (!window.confirm("למחוק את החדר וכל הפריטים בו? הפעולה בלתי הפיכה.")) e.preventDefault();
          }}
        >
          <button type="submit" className="text-red-600 hover:underline">
            מחיקת חדר
          </button>
        </form>
      </div>
    </div>
  );
}
