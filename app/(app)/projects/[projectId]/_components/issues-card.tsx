import { ErrorState } from "@/components/ui/states";
import type { DashboardData } from "../_lib/dashboard-types";
import { DashboardCard } from "./dashboard-card";

export function IssuesCard({ projectId, section }: { projectId: string; section: DashboardData["issues"] }) {
  return (
    <DashboardCard title="בעיות פתוחות" href={`/projects/${projectId}/issues`}>
      <IssuesCardBody section={section} />
    </DashboardCard>
  );
}

function IssuesCardBody({ section }: { section: DashboardData["issues"] }) {
  if (section.status === "error") {
    return <ErrorState title="לא נטען" description="לא הצלחנו לטעון את הבעיות הפתוחות כרגע." />;
  }
  if (section.data.count === 0) {
    return <p className="text-sm text-green-700">אין בעיות פתוחות</p>;
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
