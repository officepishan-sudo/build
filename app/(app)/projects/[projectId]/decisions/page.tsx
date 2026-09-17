import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { DecisionsPageContent } from "@/features/decisions/components/decisions-page-content";

export default async function ProjectDecisionsPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="מרכז החלטות"
        description="כל ההחלטות הפתוחות של הפרויקט במקום אחד - עם דדליין, תלות ומקור, כדי שכלום לא ייפול בין הכיסאות."
      />
      <DecisionsPageContent userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
