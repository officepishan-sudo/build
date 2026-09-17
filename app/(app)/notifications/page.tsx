import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { NotificationList } from "@/features/notifications/components/notification-list";

export default async function NotificationsPage() {
  const session = await requireSession();

  return (
    <div>
      <PageHeader
        title="מרכז התראות"
        description="כל ההתראות שלכם מכל הפרויקטים, במקום אחד - כל התראה עם סיבה וברירת פעולה ברורה."
      />
      <div className="max-w-2xl">
        <NotificationList userId={session.userId} />
      </div>
    </div>
  );
}
