import { EmptyState, ErrorState } from "@/components/ui/states";
import { AppError } from "@/lib/errors";
import { BudgetSummaryHeader } from "./budget-summary-header";
import { BudgetLineRow } from "./budget-line-row";
import { listBudgetOverview } from "../service";

const HEADERS = ["קטגוריה", "מתוכנן", "התחייבויות", "בפועל", "שולם", "נותר", "פער", "תחזית", "פעולות"];

export async function BudgetList({ userId, projectId }: { userId: string; projectId: string }) {
  let overview: Awaited<ReturnType<typeof listBudgetOverview>>;
  try {
    overview = await listBudgetOverview(userId, projectId);
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את התקציב" description={message} />;
  }

  if (overview.lines.length === 0) {
    return (
      <EmptyState
        title="עדיין אין קטגוריות תקציב"
        description="הוסיפו קטגוריה ראשונה (למשל: אינסטלציה, חשמל, גינון) כדי להתחיל לעקוב אחרי התקציב."
      />
    );
  }

  return (
    <div>
      <BudgetSummaryHeader totals={overview.totals} />
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-gray-200 text-xs text-gray-500">
              {HEADERS.map((h) => (
                <th key={h} className="px-2 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {overview.lines.map((line) => (
              <BudgetLineRow key={line.id} projectId={projectId} line={line} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
