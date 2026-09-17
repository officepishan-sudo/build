import type { Decision, DecisionStatus } from "@prisma/client";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { Card } from "@/components/ui/card";
import { AppError } from "@/lib/errors";
import { DecisionRow } from "./decision-row";
import { DECISION_GROUP_LABEL, DECISION_GROUP_ORDER } from "../constants";
import { listDecisions } from "../service";

export async function DecisionList({ userId, projectId }: { userId: string; projectId: string }) {
  let decisions: Decision[];
  try {
    decisions = await listDecisions(userId, projectId);
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את ההחלטות" description={message} />;
  }

  if (decisions.length === 0) {
    return (
      <EmptyState
        title="אין החלטות פתוחות - מצוין"
        description="ברגע שתעלה החלטה שדורשת הכרעה (למשל מתוך חלופות, שינויים או תקציב), היא תופיע כאן."
      />
    );
  }

  const groups = groupByStatus(decisions);

  return (
    <div className="space-y-6">
      {DECISION_GROUP_ORDER.map((status) => {
        const items = groups[status];
        if (items.length === 0) return null;
        return (
          <section key={status}>
            <h2 className="mb-2 text-sm font-semibold text-gray-700">
              {DECISION_GROUP_LABEL[status]} ({items.length})
            </h2>
            <Card>
              <ul className="divide-y divide-gray-100">
                {items.map((decision) => (
                  <DecisionRow key={decision.id} projectId={projectId} decision={decision} />
                ))}
              </ul>
            </Card>
          </section>
        );
      })}
    </div>
  );
}

function groupByStatus(decisions: Decision[]): Record<DecisionStatus, Decision[]> {
  const groups: Record<DecisionStatus, Decision[]> = { OPEN: [], NEEDS_CHECK: [], DECIDED: [] };
  for (const decision of decisions) {
    groups[decision.status].push(decision);
  }
  return groups;
}
