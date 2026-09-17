import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { BudgetPageContent } from "@/features/budget/components/budget-page-content";

export default async function ProjectBudgetPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="תקציב"
        description="מתוכנן, התחייבויות, בפועל ושולם - ארבעה מספרים נפרדים, כדי שהתמונה הכספית תהיה שלמה ולא מטושטשת."
      />
      <BudgetPageContent userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
