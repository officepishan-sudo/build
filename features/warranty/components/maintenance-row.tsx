"use client";

import type { MaintenanceItem } from "@prisma/client";
import { formatDate } from "@/lib/format";
import { deleteMaintenanceItemAction } from "../actions";

type MaintenanceRowData = MaintenanceItem & { warranty: { itemDescription: string } | null };

export function MaintenanceRow({ projectId, item }: { projectId: string; item: MaintenanceRowData }) {
  const isOverdue = item.nextDueDate ? item.nextDueDate.getTime() < Date.now() : false;

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
      <div>
        <span className="font-medium text-gray-900">{item.title}</span>
        <p className={`text-xs ${isOverdue ? "font-medium text-red-600" : "text-gray-500"}`}>
          {item.frequency && `${item.frequency} · `}
          {item.nextDueDate ? `יעד הבא: ${formatDate(item.nextDueDate)}${isOverdue ? " (עבר המועד)" : ""}` : "בלי תאריך יעד קבוע"}
          {item.warranty && ` · קשור לאחריות: ${item.warranty.itemDescription}`}
        </p>
      </div>
      <form
        action={deleteMaintenanceItemAction.bind(null, projectId, item.id)}
        onSubmit={(e) => {
          if (!window.confirm("למחוק את התזכורת?")) e.preventDefault();
        }}
      >
        <button type="submit" className="text-xs text-red-600 hover:underline">
          מחיקה
        </button>
      </form>
    </li>
  );
}
