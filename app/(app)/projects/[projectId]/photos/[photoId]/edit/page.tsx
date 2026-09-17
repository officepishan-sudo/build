import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { PhotoForm } from "@/features/photos/components/photo-form";
import { getPhoto, listPhases } from "@/features/photos/service";

export default async function EditPhotoPage({
  params,
}: {
  params: { projectId: string; photoId: string };
}) {
  const session = await requireSession();
  const [photo, phases] = await Promise.all([
    getPhoto(session.userId, params.projectId, params.photoId),
    listPhases(session.userId, params.projectId),
  ]);

  return (
    <div>
      <PageHeader title="עריכת תמונה" description="שינוי שלב, תאריך או הערה - זו פעולה מפורשת ולא תופעת לוואי." />
      <div className="max-w-lg">
        <PhotoForm projectId={params.projectId} phases={phases} photo={photo} />
      </div>
    </div>
  );
}
