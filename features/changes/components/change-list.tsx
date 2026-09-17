import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { AppError } from "@/lib/errors";
import { listChangeRequests } from "../service";
import { ChangeRow } from "./change-row";

export async function ChangeList({ userId, projectId }: { userId: string; projectId: string }) {
  let changes: Awaited<ReturnType<typeof listChangeRequests>>;
  try {
    changes = await listChangeRequests(userId, projectId);
  } catch (error) {
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את השינויים" description={message} />;
  }

  if (changes.length === 0) {
    return (
      <EmptyState
        title="עדיין אין שינויים או תוספות"
        description="כשיעלה צורך בשינוי מהתכנון המקורי - אפשר לפתוח אותו כאן ולעקוב אחרי הסטטוס שלו עד הביצוע."
      />
    );
  }

  return (
    <Card>
      <ul className="divide-y divide-gray-100">
        {changes.map((change) => (
          <ChangeRow key={change.id} projectId={projectId} change={change} />
        ))}
      </ul>
    </Card>
  );
}
