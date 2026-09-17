import { ErrorState } from "@/components/ui/states";
import { formatDateTime } from "@/lib/format";
import type { DashboardData } from "../_lib/dashboard-types";
import { Card } from "@/components/ui/card";

const KIND_LABEL: Record<string, string> = { document: "מסמך", photo: "תמונה", message: "הודעה" };

export function ActivityCard({ section }: { section: DashboardData["activity"] }) {
  return (
    <Card>
      <h3 className="mb-2 text-sm font-semibold text-gray-700">פעילות אחרונה</h3>
      <ActivityCardBody section={section} />
    </Card>
  );
}

function ActivityCardBody({ section }: { section: DashboardData["activity"] }) {
  if (section.status === "error") {
    return <ErrorState title="לא נטען" description="לא הצלחנו לטעון את הפעילות האחרונה כרגע." />;
  }
  if (section.data.length === 0) {
    return <p className="text-sm text-gray-500">עדיין אין פעילות מתועדת בפרויקט.</p>;
  }
  return (
    <ul className="space-y-2 text-sm">
      {section.data.map((item) => (
        <li key={`${item.kind}-${item.id}`} className="flex justify-between gap-2">
          <span className="truncate text-gray-800">
            <span className="text-gray-400">[{KIND_LABEL[item.kind]}]</span> {item.label}
          </span>
          <span className="shrink-0 text-xs text-gray-500">{formatDateTime(item.at)}</span>
        </li>
      ))}
    </ul>
  );
}
