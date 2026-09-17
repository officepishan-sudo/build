import { EmptyState, PartialBanner } from "@/components/ui/states";
import type { DashboardData } from "../_lib/dashboard-types";
import { getRecommendedActions } from "../_lib/recommended-actions";
import { StatusHeader } from "./status-header";
import { NextActionsSection } from "./next-actions-section";
import { DecisionsCard } from "./decisions-card";
import { BudgetCard } from "./budget-card";
import { ScheduleCard } from "./schedule-card";
import { DeliveriesCard } from "./deliveries-card";
import { ChangesCard } from "./changes-card";
import { IssuesCard } from "./issues-card";
import { ActivityCard } from "./activity-card";

type SectionKey = "openDecisions" | "budget" | "schedule" | "deliveries" | "changeRequests" | "issues" | "activity";

const SECTION_LABEL: Record<SectionKey, string> = {
  openDecisions: "החלטות פתוחות",
  budget: "תקציב",
  schedule: "לוח זמנים",
  deliveries: "אספקות",
  changeRequests: "שינויים",
  issues: "בעיות",
  activity: "פעילות אחרונה",
};

export function DashboardView({ projectId, data }: { projectId: string; data: DashboardData }) {
  const missing = (Object.entries(SECTION_LABEL) as [SectionKey, string][])
    .filter(([key]) => data[key].status === "error")
    .map(([, label]) => label);

  return (
    <div>
      <StatusHeader header={data.header} />
      {missing.length > 0 && <PartialBanner missing={missing.join(", ")} />}
      {data.isNewProject && (
        <div className="mb-6">
          <EmptyState
            title="פרויקט חדש - בואו נתחיל"
            description="עוד לא נאספו הרבה נתונים על הפרויקט הזה. אלה הצעדים שיעזרו להתחיל לבנות תמונה מלאה."
          />
        </div>
      )}
      <NextActionsSection actions={getRecommendedActions(projectId, data)} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DecisionsCard projectId={projectId} section={data.openDecisions} />
        <BudgetCard projectId={projectId} section={data.budget} />
        <ScheduleCard projectId={projectId} section={data.schedule} />
        <DeliveriesCard projectId={projectId} section={data.deliveries} />
        <ChangesCard projectId={projectId} section={data.changeRequests} />
        <IssuesCard projectId={projectId} section={data.issues} />
      </div>
      <div className="mt-4">
        <ActivityCard section={data.activity} />
      </div>
    </div>
  );
}
