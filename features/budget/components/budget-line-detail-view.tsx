import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConflictBanner, EmptyState, ErrorState } from "@/components/ui/states";
import { AppError, NotFoundError } from "@/lib/errors";
import { formatCurrency } from "@/lib/format";
import { varianceTone } from "../calc";
import { getBudgetLineDetail } from "../service";
import { ExpenseList } from "./expense-list";
import { LogExpenseForm } from "./log-expense-form";
import { VarianceReasonForm } from "./variance-reason-form";

export async function BudgetLineDetailView({
  userId,
  projectId,
  lineId,
}: {
  userId: string;
  projectId: string;
  lineId: string;
}) {
  let detail: Awaited<ReturnType<typeof getBudgetLineDetail>>;
  try {
    detail = await getBudgetLineDetail(userId, projectId, lineId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return <EmptyState title="הקטגוריה לא נמצאה" description="ייתכן שהקישור שגוי." />;
    }
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את הקטגוריה" description={message} />;
  }

  const { line, summary, conflicts } = detail;

  return (
    <div className="max-w-3xl space-y-4">
      <Link href={`/projects/${projectId}/budget`} className="text-sm text-brand-600 hover:underline">
        חזרה לתקציב
      </Link>

      {conflicts.map((c) => (
        <ConflictBanner
          key={c.orderId}
          message={`הזמנה ${c.orderNumber} עומדת על ${formatCurrency(c.orderTotal)}, אך ההוצאות שנרשמו מולה מסתכמות ב-${formatCurrency(c.expensesTotal)}.`}
        />
      ))}

      <Card>
        <h1 className="text-lg font-semibold text-gray-900">{line.category}</h1>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Detail label="מתוכנן" value={formatCurrency(summary.planned)} />
          <Detail label="התחייבויות" value={formatCurrency(summary.committed)} />
          <Detail label="בפועל" value={formatCurrency(summary.actual)} />
          <Detail label="שולם" value={formatCurrency(summary.paid)} />
          <Detail label="נותר (מתוכנן פחות בפועל)" value={formatCurrency(summary.remaining)} />
          <Detail label="תחזית (הערכה בלבד)" value={formatCurrency(summary.forecast)} />
        </dl>
        <div className="mt-3">
          <Badge tone={varianceTone(summary.variance)}>פער: {formatCurrency(summary.variance)}</Badge>
          {summary.varianceReason && <p className="mt-1 text-xs text-gray-500">סיבת הפער: {summary.varianceReason}</p>}
        </div>
        {summary.isOverageUnexplained && <VarianceReasonForm projectId={projectId} lineId={lineId} />}
      </Card>

      <ExpenseList expenses={line.expenses} />
      <LogExpenseForm projectId={projectId} lineId={lineId} />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-400">{label}</dt>
      <dd className="font-medium text-gray-800">{value}</dd>
    </div>
  );
}
