import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { BookScreen } from "./_components/book-screen";

export default async function ProjectBookPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="ספר הפרויקט"
        description="תצוגה מרכזת וניתנת לחיפוש של כל מה שקרה בפרויקט - לכל סעיף יש קישור למסך המלא."
      />
      <BookScreen userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
