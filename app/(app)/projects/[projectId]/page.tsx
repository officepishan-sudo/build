import { requireSession } from "@/lib/auth/session";
import { AppError, NotFoundError } from "@/lib/errors";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { loadDashboardData } from "./_lib/dashboard-data";
import { DashboardView } from "./_components/dashboard-view";

export default async function ProjectDashboardPage({ params }: { params: { projectId: string } }) {
  const session = await requireSession();

  try {
    const data = await loadDashboardData(session.userId, params.projectId);
    return <DashboardView projectId={params.projectId} data={data} />;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return <EmptyState title="הפרויקט לא נמצא" description="ייתכן שהוא נמחק, או שהקישור שגוי." />;
    }
    const message = error instanceof AppError ? error.message : undefined;
    return <ErrorState title="לא הצלחנו לטעון את מרכז הפרויקט" description={message} />;
  }
}
