import type { RegulatoryChecklistItem } from "@prisma/client";
import { updateChecklistItemAction } from "../actions";

export function ChecklistItemRow({ projectId, item }: { projectId: string; item: RegulatoryChecklistItem }) {
  return (
    <li className="p-3">
      <form action={updateChecklistItemAction.bind(null, projectId, item.id)} className="space-y-2">
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="isChecked" defaultChecked={item.isChecked} className="mt-1 h-4 w-4" />
          <span>
            <span className="font-medium text-gray-900">{item.title}</span>
            {item.description && <p className="text-gray-500">{item.description}</p>}
          </span>
        </label>
        <textarea
          name="notes"
          defaultValue={item.notes ?? ""}
          placeholder='הערות - למשל "לא יודע, צריך לבדוק מול הרשות המקומית"'
          rows={2}
          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
        />
        <button type="submit" className="text-xs font-medium text-brand-700 hover:underline">
          שמירה
        </button>
      </form>
    </li>
  );
}
