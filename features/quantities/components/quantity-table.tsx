import { QuantityRow } from "./quantity-row";
import type { PhaseOption, QuantityRowData } from "../types";

const COLUMN_LABELS = ["תיאור", "כמות", "חומר", "עבודה", "הובלה", "סה״כ", "מקור", "שלב", "פעולות"];

export function QuantityTable({
  projectId,
  items,
  phases,
  categories,
}: {
  projectId: string;
  items: QuantityRowData[];
  phases: PhaseOption[];
  categories: string[];
}) {
  const grouped = groupByCategory(items);

  return (
    <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
      {Object.entries(grouped).map(([category, rows]) => (
        <table key={category} className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-right text-xs font-semibold uppercase text-gray-500">
              <th colSpan={COLUMN_LABELS.length} className="px-2 py-2 text-sm font-semibold text-gray-800">
                {category}
              </th>
            </tr>
            <tr className="border-b border-gray-200 text-right text-xs text-gray-500">
              {COLUMN_LABELS.map((label) => (
                <th key={label} className="px-2 py-1 font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <QuantityRow key={item.id} projectId={projectId} item={item} phases={phases} categories={categories} />
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}

function groupByCategory(items: QuantityRowData[]): Record<string, QuantityRowData[]> {
  const groups: Record<string, QuantityRowData[]> = {};
  for (const item of items) {
    (groups[item.category] ??= []).push(item);
  }
  return groups;
}
