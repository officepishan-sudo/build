import { ErrorState } from "@/components/ui/states";
import type { DashboardData } from "../_lib/dashboard-types";
import { DashboardCard } from "./dashboard-card";

export function ChangesCard({ projectId, section }: { projectId: string; section: DashboardData["changeRequests"] }) {
  return (
    <DashboardCard title="שינויים פתוחים" href={`/projects/${projectId}/changes`}>
      <ChangesCardBody section={section} />
    </DashboardCard>
  );
}

function ChangesCardBody({ section }: { section: DashboardData["changeRequests"] }) {
  if (section.status === "error") {
    return <ErrorState title="לא נטען" description="לא הצלחנו לטעון את בקשות השינוי כרגע." />;
  }
  if (section.data.count === 0) {
    return <p className="text-sm text-green-700">אין בקשות שינוי פתוחות</p>;
  }
  return (
    <>
      <p className="text-2xl font-semibold text-gray-900">{section.data.count}</p>
      <ul className="mt-2 space-y-1 text-xs text-gray-500">
        {section.data.items.slice(0, 3).map((item) => (
          <li key={item.id} className="truncate">
            {item.title}
          </li>
        ))}
      </ul>
    </>
  );
}
