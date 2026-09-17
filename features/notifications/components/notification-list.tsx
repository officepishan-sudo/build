import { EmptyState } from "@/components/ui/states";
import { listMyNotifications } from "../service";
import { NotificationRow } from "./notification-row";

export async function NotificationList({ userId }: { userId: string }) {
  const notifications = await listMyNotifications(userId);

  if (notifications.length === 0) {
    return (
      <EmptyState
        title="אין התראות חדשות - הכל מעודכן"
        description="כשיהיה משהו שדורש תשומת לב באחד הפרויקטים שלכם, הוא יופיע כאן."
      />
    );
  }

  return <ul className="space-y-3">{notifications.map((n) => <NotificationRow key={n.id} notification={n} />)}</ul>;
}
