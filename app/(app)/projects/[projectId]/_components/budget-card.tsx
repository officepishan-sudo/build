import { ErrorState } from "@/components/ui/states";
import { formatCurrency } from "@/lib/format";
import type { DashboardData } from "../_lib/dashboard-types";
import { DashboardCard } from "./dashboard-card";

export function BudgetCard({ projectId, section }: { projectId: string; section: DashboardData["budget"] }) {
  return (
    <DashboardCard title="תקציב ותחזית" href={`/projects/${projectId}/budget`}>
      <BudgetCardBody section={section} />
    </DashboardCard>
  );
}

function BudgetCardBody({ section }: { section: DashboardData["budget"] }) {
  if (section.status === "error") {
    return <ErrorState title="לא נטען" description="לא הצלחנו לטעון את נתוני התקציב כרגע." />;
  }
  if (section.data.lineCount === 0) {
    return <p className="text-sm text-gray-500">עדיין לא הוגדר תקציב לפרויקט.</p>;
  }
  return <BudgetTotals data={section.data} />;
}

function BudgetTotals({ data }: { data: Extract<DashboardData["budget"], { status: "ok" }>["data"] }) {
  const variance = data.actualTotal - data.plannedTotal;
  return (
    <div className="space-y-1 text-sm">
      <Row label="מתוכנן" value={formatCurrency(data.plannedTotal)} />
      <Row label="בפועל" value={formatCurrency(data.actualTotal)} />
      <Row label="שולם" value={formatCurrency(data.paidTotal)} />
      <p className={`text-xs ${variance > 0 ? "text-red-600" : "text-gray-500"}`}>
        תחזית: {variance > 0 ? "חריגה של " : "בתוך התקציב, פער של "}
        {formatCurrency(Math.abs(variance))}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
