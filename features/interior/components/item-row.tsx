"use client";

import { useState } from "react";
import type { InteriorItem } from "@prisma/client";
import { deleteItemAction } from "../actions";
import { ItemForm } from "./item-form";

export function ItemRow({ projectId, roomId, item }: { projectId: string; roomId: string; item: InteriorItem }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <ItemForm projectId={projectId} roomId={roomId} item={item} onDone={() => setEditing(false)} />;
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
      <div>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{item.category}</span>
        <span className="mr-2 text-gray-800">{item.decisionText || "עדיין אין החלטה לפריט הזה"}</span>
        {item.quantity && <span className="mr-2 text-gray-500">כמות: {Number(item.quantity)}</span>}
      </div>
      <div className="flex gap-3 text-xs">
        <button type="button" onClick={() => setEditing(true)} className="text-brand-700 hover:underline">
          עריכה
        </button>
        <form
          action={deleteItemAction.bind(null, projectId, roomId, item.id)}
          onSubmit={(e) => {
            if (!window.confirm("למחוק את הפריט?")) e.preventDefault();
          }}
        >
          <button type="submit" className="text-red-600 hover:underline">
            מחיקה
          </button>
        </form>
      </div>
    </li>
  );
}
