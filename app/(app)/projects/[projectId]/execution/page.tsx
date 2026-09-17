import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/states";
import { PhaseExecutionCard } from "@/features/execution/components/phase-execution-card";
import { listExecutionOverview } from "@/features/execution/service";

export default async function ExecutionPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();
  const { projectId } = params;
  const { phases, documentsCount, expensesCount } = await listExecutionOverview(session.userId, projectId);

  return (
    <div>
      <PageHeader
        title="ניהול ביצוע"
        description="מעקב סטטוס יומיומי לפי שלב - עדכון משימות, ותקצירי תמונות/מסמכים/הוצאות."
      />
      <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <Link href={`/projects/${projectId}/documents`} className="hover:underline">
          מסמכי הפרויקט: {documentsCount}
        </Link>
        <Link href={`/projects/${projectId}/budget`} className="hover:underline">
          הוצאות שנרשמו: {expensesCount}
        </Link>
      </div>

      {phases.length === 0 ? (
        <EmptyState
          title="עדיין אין שלבים בלוח הזמנים"
          description="ניהול הביצוע מתבסס על שלבים - קודם יש להגדיר אותם בלוח הזמנים."
          action={
            <Link href={`/projects/${projectId}/schedule`} className="text-brand-600 hover:underline">
              ללוח הזמנים
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {phases.map((phase) => (
            <PhaseExecutionCard key={phase.id} projectId={projectId} phase={phase} />
          ))}
        </div>
      )}
    </div>
  );
}
