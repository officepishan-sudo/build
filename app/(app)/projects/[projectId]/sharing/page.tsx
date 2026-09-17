import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { SharingPageContent } from "@/features/sharing/components/sharing-page-content";

export default async function ProjectSharingPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="שיתוף והרשאות"
        description="לא כל משתתף רואה הכל - כל שיתוף מוגדר לפי רמת גישה מפורשת, מצפייה בלבד ועד ניהול תפעולי."
      />
      <SharingPageContent userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
