import { ChangeList } from "./change-list";
import { CreateChangeForm } from "./create-change-form";

export function ChangesPageContent({ userId, projectId }: { userId: string; projectId: string }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ChangeList userId={userId} projectId={projectId} />
      </div>
      <div>
        <CreateChangeForm projectId={projectId} />
      </div>
    </div>
  );
}
