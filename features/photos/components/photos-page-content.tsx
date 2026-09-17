import { PhotoTimeline } from "./photo-timeline";
import { PhotoForm } from "./photo-form";
import { listPhases } from "../service";

export async function PhotosPageContent({ userId, projectId }: { userId: string; projectId: string }) {
  const phases = await listPhases(userId, projectId);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <PhotoTimeline userId={userId} projectId={projectId} />
      </div>
      <div>
        <PhotoForm projectId={projectId} phases={phases} />
      </div>
    </div>
  );
}
