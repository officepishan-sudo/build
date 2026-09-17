import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { MessagesPageContent } from "@/features/messages/components/messages-page-content";

export default async function ProjectMessagesPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="תקשורת בפרויקט"
        description="כל השיחה במקום אחד, עם הקשר לפריטים - כדי שהחלטות חשובות לא יישארו קבורות בצ'אט."
      />
      <MessagesPageContent userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
