import { ErrorState } from "@/components/ui/states";
import { formatDate } from "@/lib/format";
import type { DashboardData } from "../_lib/dashboard-types";
import { DashboardCard } from "./dashboard-card";

const PHASE_STATUS_LABEL: Record<string, string> = {
  NOT_STARTED: "טרם התחיל",
  IN_PROGRESS: "בביצוע",
  DONE: "הושלם",
  DELAYED: "בעיכוב",
};

export function ScheduleCard({ projectId, section }: { projectId: string; section: DashboardData["schedule"] }) {
  return (
    <DashboardCard title="לוח זמנים קרוב" href={`/projects/${projectId}/schedule`}>
      <ScheduleCardBody section={section} />
    </DashboardCard>
  );
}

function ScheduleCardBody({ section }: { section: DashboardData["schedule"] }) {
  if (section.status === "error") {
    return <ErrorState title="לא נטען" description="לא הצלחנו לטעון את לוח הזמנים כרגע." />;
  }
  if (section.data.length === 0) {
    return <p className="text-sm text-gray-500">עדיין לא הוגדרו שלבים בלוח הזמנים.</p>;
  }
  return (
    <ul className="space-y-1 text-sm">
      {section.data.map((phase) => (
        <li key={phase.id} className="flex justify-between gap-2">
          <span className="truncate text-gray-800">{phase.name}</span>
          <span className={`shrink-0 text-xs ${phase.status === "DELAYED" ? "text-red-600" : "text-gray-500"}`}>
            {phase.startDate ? formatDate(phase.startDate) : PHASE_STATUS_LABEL[phase.status]}
          </span>
        </li>
      ))}
    </ul>
  );
}
