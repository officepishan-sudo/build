import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { PhotosPageContent } from "@/features/photos/components/photos-page-content";

export default async function ProjectPhotosPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="ציר זמן תמונות"
        description="תיעוד ויזואלי של הפרויקט לפי שלב ותאריך - כדאי לצלם לפני שמכסים או משנים משהו."
      />
      <PhotosPageContent userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
