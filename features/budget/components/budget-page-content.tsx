import { BudgetList } from "./budget-list";
import { CreateBudgetLineForm } from "./create-budget-line-form";

export function BudgetPageContent({ userId, projectId }: { userId: string; projectId: string }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <BudgetList userId={userId} projectId={projectId} />
      </div>
      <div>
        <CreateBudgetLineForm projectId={projectId} />
      </div>
    </div>
  );
}
