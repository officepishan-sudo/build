import { DecisionList } from "./decision-list";
import { CreateDecisionForm } from "./create-decision-form";

export function DecisionsPageContent({ userId, projectId }: { userId: string; projectId: string }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <DecisionList userId={userId} projectId={projectId} />
      </div>
      <div>
        <CreateDecisionForm projectId={projectId} />
      </div>
    </div>
  );
}
