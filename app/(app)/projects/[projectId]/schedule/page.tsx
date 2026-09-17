import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { ScheduleScreen } from "@/features/schedule/components/schedule-screen";
import { getDeliveryCountsByPhase } from "./_lib/phase-delivery-counts";

export default async function SchedulePage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();
  const deliveryCountsByPhase = await getDeliveryCountsByPhase(params.projectId);

  return (
    <div>
      <PageHeader title="לוח זמנים" description="שלבים, משכים ותלויות - עם המשימות שלכל שלב." />
      <ScheduleScreen userId={session.userId} projectId={params.projectId} deliveryCountsByPhase={deliveryCountsByPhase} />
    </div>
  );
}
