"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { NeedsCheckBadge } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { deleteQuantityItemAction } from "../actions";
import { QuantityItemForm } from "./quantity-item-form";
import type { QuantityRowData, PhaseOption } from "../types";

export function QuantityRow({
  projectId,
  item,
  phases,
  categories,
}: {
  projectId: string;
  item: QuantityRowData;
  phases: PhaseOption[];
  categories: string[];
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <tr>
        <td colSpan={9} className="p-2">
          <QuantityItemForm projectId={projectId} phases={phases} categories={categories} item={item} onDone={() => setEditing(false)} />
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-100 text-sm">
      <td className="px-2 py-2">{item.description}</td>
      <td className="px-2 py-2">
        {Number(item.quantity)} {item.unit}
      </td>
      <td className="px-2 py-2">{formatCurrency(item.materialCost)}</td>
      <td className="px-2 py-2">{formatCurrency(item.laborCost)}</td>
      <td className="px-2 py-2">{formatCurrency(item.transportCost)}</td>
      <td className="px-2 py-2 font-medium">{formatCurrency(item.totalCost)}</td>
      <td className="px-2 py-2 text-gray-500">{item.source ?? "—"}</td>
      <td className="px-2 py-2">
        {item.phase ? <Link href={`/projects/${projectId}/schedule`} className="text-brand-700 hover:underline">{item.phase.name}</Link> : "—"}
      </td>
      <td className="px-2 py-2">
        <div className="flex items-center gap-2">
          {item.needsCheck && <NeedsCheckBadge />}
          <Button type="button" variant="ghost" onClick={() => setEditing(true)}>
            ערוך
          </Button>
          <form action={deleteQuantityItemAction.bind(null, projectId, item.id)}>
            <Button type="submit" variant="ghost" onClick={confirmDelete}>
              מחיקה
            </Button>
          </form>
        </div>
      </td>
    </tr>
  );
}

function confirmDelete(e: React.MouseEvent<HTMLButtonElement>) {
  if (!window.confirm("למחוק את השורה? הפעולה בלתי הפיכה.")) {
    e.preventDefault();
  }
}
