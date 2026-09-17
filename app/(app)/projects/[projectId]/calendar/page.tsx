import { requireSession } from "@/lib/auth/session";
import { requireProjectAccess } from "@/lib/auth/rbac";
import { PageHeader } from "@/components/ui/page-header";
import { CalendarScreen } from "./_components/calendar-screen";

export default async function CalendarPage({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams: { type?: string };
}) {
  const session = await requireSession();
  await requireProjectAccess(params.projectId, session.userId, "VIEW");

  return (
    <div>
      <PageHeader title="לוח שנה" description="מבט כרונולוגי מאוחד - משימות, אספקות, תשלומים ודדליינים של החלטות." />
      <CalendarScreen projectId={params.projectId} typeFilter={searchParams.type} />
    </div>
  );
}
