"use client";

import type { CanvasElement } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { deletePinAction } from "../actions";
import { PinForm } from "./pin-form";

/** תצוגת רשימה - חלופה לתצוגה החזותית, וגם הדרך היחידה להוסיף פין כשאין תמונת בסיס. */
export function PinList({
  projectId,
  pins,
  requirements,
}: {
  projectId: string;
  pins: CanvasElement[];
  requirements: { id: string; label: string }[];
}) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">רשימת פינים ({pins.length})</h2>
      {pins.length === 0 ? (
        <EmptyState title="אין עדיין פינים" description="הוסיפו פין ידנית, או לחצו על התמונה למעלה אם יש כזו." />
      ) : (
        <ul className="mb-4 divide-y divide-gray-100">
          {pins.map((pin) => (
            <PinListRow key={pin.id} projectId={projectId} pin={pin} />
          ))}
        </ul>
      )}
      <details>
        <summary className="cursor-pointer text-sm font-medium text-brand-700">הוספת פין ידנית</summary>
        <div className="mt-2 max-w-sm">
          <PinForm projectId={projectId} requirements={requirements} />
        </div>
      </details>
    </Card>
  );
}

function PinListRow({ projectId, pin }: { projectId: string; pin: CanvasElement }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
      <div>
        <span className="font-medium text-gray-900">{pin.label ?? "(ללא תווית)"}</span>
        {pin.note && <p className="text-gray-500">{pin.note}</p>}
        {pin.linkedRequirementId && <p className="text-xs text-gray-400">מקושר לדרישה</p>}
      </div>
      <form
        action={deletePinAction.bind(null, projectId, pin.id)}
        onSubmit={(e) => {
          if (!window.confirm("למחוק את הפין? הפעולה בלתי הפיכה.")) e.preventDefault();
        }}
      >
        <button type="submit" className="text-xs text-red-600 hover:underline">
          מחיקה
        </button>
      </form>
    </li>
  );
}
