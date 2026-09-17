import { NeedsCheckBadge } from "@/components/ui/states";
import { formatCurrency } from "@/lib/format";

// "בדיקת פער": מציג בשקיפות איך מחיר ההצעה מושווה לאומדן הפרויקט, בלי לקבוע מסקנה.
export function GapDetails({ price, gapVsEstimate }: { price: number; gapVsEstimate: number | null }) {
  if (gapVsEstimate === null) {
    return <NeedsCheckBadge label="אין אומדן להשוואה" />;
  }
  const estimateTotal = price - gapVsEstimate;
  const isAbove = gapVsEstimate > 0;

  return (
    <details className="text-sm">
      <summary className="cursor-pointer text-brand-700">
        פער מהאומדן: {isAbove ? "+" : ""}
        {formatCurrency(gapVsEstimate)}
      </summary>
      <dl className="mt-2 space-y-1 rounded-md border border-gray-200 bg-gray-50 p-2 text-xs">
        <div className="flex justify-between">
          <dt className="text-gray-500">מחיר ההצעה</dt>
          <dd>{formatCurrency(price)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">אומדן הפרויקט (בעת הוספת ההצעה)</dt>
          <dd>{formatCurrency(estimateTotal)}</dd>
        </div>
        <div className="flex justify-between font-medium">
          <dt>הפער</dt>
          <dd className={isAbove ? "text-red-700" : "text-green-700"}>{formatCurrency(gapVsEstimate)}</dd>
        </div>
      </dl>
    </details>
  );
}
