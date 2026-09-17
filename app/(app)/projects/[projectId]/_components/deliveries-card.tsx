import { ErrorState } from "@/components/ui/states";
import { formatDate } from "@/lib/format";
import type { DashboardData } from "../_lib/dashboard-types";
import { DashboardCard } from "./dashboard-card";

export function DeliveriesCard({ projectId, section }: { projectId: string; section: DashboardData["deliveries"] }) {
  return (
    <DashboardCard title="אספקות קרובות" href={`/projects/${projectId}/deliveries`}>
      <DeliveriesCardBody section={section} />
    </DashboardCard>
  );
}

function DeliveriesCardBody({ section }: { section: DashboardData["deliveries"] }) {
  if (section.status === "error") {
    return <ErrorState title="לא נטען" description="לא הצלחנו לטעון את האספקות הקרובות כרגע." />;
  }
  if (section.data.length === 0) {
    return <p className="text-sm text-gray-500">אין אספקות ממתינות כרגע.</p>;
  }
  return (
    <ul className="space-y-1 text-sm">
      {section.data.map((delivery) => (
        <li key={delivery.id} className="flex justify-between gap-2">
          <span className="truncate text-gray-800">{delivery.itemsSummary ?? "אספקה"}</span>
          <span className="shrink-0 text-xs text-gray-500">
            {delivery.expectedDate ? formatDate(delivery.expectedDate) : "אין תאריך צפוי"}
          </span>
        </li>
      ))}
    </ul>
  );
}
