"use client";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { deleteWarrantyAction } from "../actions";
import { WARRANTY_STATUS_LABEL, WARRANTY_STATUS_TONE } from "../constants";
import type { WarrantyStatus } from "../warranty-status";

type WarrantyRowData = {
  id: string;
  itemDescription: string;
  expiryDate: Date;
  status: WarrantyStatus;
  supplier: { name: string } | null;
  professional: { name: string } | null;
};

export function WarrantyRow({ projectId, warranty }: { projectId: string; warranty: WarrantyRowData }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{warranty.itemDescription}</span>
          <Badge tone={WARRANTY_STATUS_TONE[warranty.status]}>{WARRANTY_STATUS_LABEL[warranty.status]}</Badge>
        </div>
        <p className="text-xs text-gray-500">
          תוקף עד {formatDate(warranty.expiryDate)}
          {warranty.supplier && ` · ספק: ${warranty.supplier.name}`}
          {warranty.professional && ` · איש מקצוע: ${warranty.professional.name}`}
        </p>
      </div>
      <form
        action={deleteWarrantyAction.bind(null, projectId, warranty.id)}
        onSubmit={(e) => {
          if (!window.confirm("למחוק את רשומת האחריות?")) e.preventDefault();
        }}
      >
        <button type="submit" className="text-xs text-red-600 hover:underline">
          מחיקה
        </button>
      </form>
    </li>
  );
}
