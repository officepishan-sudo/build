import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { CanvasScreen } from "@/features/canvas/components/canvas-screen";

export default async function ProjectCanvasPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="קנבס תכנון אינטראקטיבי"
        description="תמונה או שרטוט של הפרויקט עם פינים - כדי לחבר את התכנון המרחבי לדרישות ולכמויות."
      />
      <CanvasScreen userId={session.userId} projectId={params.projectId} />
    </div>
  );
}
