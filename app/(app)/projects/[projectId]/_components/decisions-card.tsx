import { ErrorState } from "@/components/ui/states";
import { formatDate } from "@/lib/format";
import type { DashboardData } from "../_lib/dashboard-types";
import { DashboardCard } from "./dashboard-card";

export function DecisionsCard({ projectId, section }: { projectId: string; section: DashboardData["openDecisions"] }) {
  return (
    <DashboardCard title="החלטות פתוחות" href={`/projects/${projectId}/decisions`}>
      <DecisionsCardBody section={section} />
    </DashboardCard>
  );
}

function DecisionsCardBody({ section }: { section: DashboardData["openDecisions"] }) {
  if (section.status === "error") {
    return <ErrorState title="לא נטען" description="לא הצלחנו לטעון את ההחלטות הפתוחות כרגע." />;
  }
  if (section.data.count === 0) {
    return <p className="text-sm text-green-700">אין החלטות פתוחות - מצוין</p>;
  }
  return (
    <>
      <p className="text-2xl font-semibold text-gray-900">{section.data.count}</p>
      <ul className="mt-2 space-y-1 text-xs text-gray-500">
        {section.data.items.slice(0, 3).map((item) => (
          <li key={item.id} className="truncate">
            {item.title}
            {item.deadline && ` · ${formatDate(item.deadline)}`}
          </li>
        ))}
      </ul>
    </>
  );
}
