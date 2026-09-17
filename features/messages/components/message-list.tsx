import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { listMessages } from "../service";
import { MessageRow } from "./message-row";

export async function MessageList({ userId, projectId }: { userId: string; projectId: string }) {
  const messages = await listMessages(userId, projectId);

  if (messages.length === 0) {
    return (
      <EmptyState
        title="אין עדיין שיחה בפרויקט הזה"
        description="שלחו את ההודעה הראשונה - כל תקשורת חשובה כדאי שתתועד כאן, ולא תישאר רק בוואטסאפ."
      />
    );
  }

  return (
    <Card>
      <p className="mb-2 text-xs text-amber-700">
        החלטה חשובה עלתה בשיחה? עדיף להפוך אותה להחלטה/משימה אמיתית ולא להשאיר אותה קבורה בטקסט.
      </p>
      <ul className="divide-y divide-gray-100">
        {messages.map((message) => (
          <MessageRow key={message.id} projectId={projectId} message={message} />
        ))}
      </ul>
    </Card>
  );
}
