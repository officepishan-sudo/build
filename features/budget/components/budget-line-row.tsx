import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { NeedsCheckBadge } from "@/components/ui/states";
import { formatCurrency } from "@/lib/format";
import type { BudgetLineSummary } from "../calc";

export function BudgetLineRow({ projectId, line }: { projectId: string; line: BudgetLineSummary }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 pr-2">
        <Link href={`/projects/${projectId}/budget/${line.id}`} className="font-medium text-gray-900 hover:underline">
          {line.category}
        </Link>
        {!line.hasActualYet && <p className="text-xs text-gray-400">מתוכנן בלבד - אין עדיין הוצאה בפועל</p>}
        {line.hasUnquantifiedPartial && (
          <p className="text-xs text-amber-700">יש תשלום חלקי - הסכום המדויק ששולם דורש בדיקה</p>
        )}
      </td>
      <Cell value={formatCurrency(line.planned)} />
      <Cell value={formatCurrency(line.committed)} />
      <Cell value={formatCurrency(line.actual)} />
      <Cell value={formatCurrency(line.paid)} />
      <Cell value={formatCurrency(line.remaining)} />
      <td className="px-2 py-3 text-sm">
        <VarianceCell line={line} />
      </td>
      <td className="px-2 py-3 text-sm text-gray-500">
        {formatCurrency(line.forecast)}
        <p className="text-[11px] text-gray-400">הערכה בלבד, לא נתון סופי</p>
      </td>
      <td className="py-3 pl-2">
        <div className="flex flex-wrap gap-2">
          <Link href={`/projects/${projectId}/budget/${line.id}`} className="text-xs text-brand-600 hover:underline">
            פתח קטגוריה
          </Link>
          <Link href={`/projects/${projectId}/payments`} className="text-xs text-brand-600 hover:underline">
            תשלום
          </Link>
          <Link href={`/projects/${projectId}/changes`} className="text-xs text-brand-600 hover:underline">
            שינוי
          </Link>
        </div>
      </td>
    </tr>
  );
}

function Cell({ value }: { value: string }) {
  return <td className="px-2 py-3 text-sm text-gray-700">{value}</td>;
}

function VarianceCell({ line }: { line: BudgetLineSummary }) {
  const tone = line.variance > 0 ? "danger" : line.variance < 0 ? "success" : "neutral";
  return (
    <div className="space-y-1">
      <Badge tone={tone}>{formatCurrency(line.variance)}</Badge>
      {line.isOverageUnexplained && <NeedsCheckBadge label="חריגה - דורש הסבר" />}
      {line.varianceReason && <p className="text-[11px] text-gray-400">{line.varianceReason}</p>}
    </div>
  );
}
