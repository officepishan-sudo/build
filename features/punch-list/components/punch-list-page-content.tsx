import { DefectsList } from "./defects-list";
import { CreateDefectForm } from "./create-defect-form";

export function PunchListPageContent({ userId, projectId }: { userId: string; projectId: string }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <DefectsList userId={userId} projectId={projectId} />
      </div>
      <div>
        <CreateDefectForm projectId={projectId} />
      </div>
    </div>
  );
}
