import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { computeBudgetTotals } from "../calc";

const TILES: { key: keyof ReturnType<typeof computeBudgetTotals>; label: string; hint: string }[] = [
  { key: "planned", label: "מתוכנן", hint: "אומדן - סעיף 8.2" },
  { key: "committed", label: "התחייבויות", hint: "הזמנות שנפתחו" },
  { key: "actual", label: "בפועל", hint: "סכום הוצאות בפועל" },
  { key: "paid", label: "שולם", hint: "תשלומים שהושלמו" },
];

export function BudgetSummaryHeader({ totals }: { totals: ReturnType<typeof computeBudgetTotals> }) {
  return (
    <Card className="mb-6">
      <p className="mb-3 text-xs text-gray-400">
        ארבעה מספרים נפרדים במכוון - אומדן, התחייבות, הוצאה בפועל ותשלום אינם אותו דבר.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {TILES.map((tile) => (
          <div key={tile.key}>
            <p className="text-xs text-gray-400">{tile.label}</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(totals[tile.key])}</p>
            <p className="text-[11px] text-gray-400">{tile.hint}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
