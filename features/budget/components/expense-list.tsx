import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";

type ExpenseRow = { id: string; description: string; amount: unknown; date: Date; orderId: string | null };

// "לא מציגים חריגה בלי מקור" (ספק 8.2 Edge Case) - זו הרשימה שמראה בדיוק
// אילו הוצאות בנו את הבפועל, כדי שאפשר יהיה להצביע על המקור בכל חריגה.
export function ExpenseList({ expenses }: { expenses: ExpenseRow[] }) {
  if (expenses.length === 0) {
    return <p className="text-sm text-gray-400">עדיין לא נרשמו הוצאות בפועל בקטגוריה הזו.</p>;
  }

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">הוצאות בפועל שמרכיבות את הסכום ({expenses.length})</h2>
      <ul className="divide-y divide-gray-100">
        {expenses.map((expense) => (
          <li key={expense.id} className="flex items-center justify-between py-2 text-sm">
            <div>
              <p className="text-gray-800">{expense.description}</p>
              <p className="text-xs text-gray-400">
                {formatDate(expense.date)}
                {expense.orderId && " · מקושר להזמנה"}
              </p>
            </div>
            <span className="font-medium text-gray-900">{formatCurrency(Number(expense.amount))}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
