import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError } from "@/lib/errors";
import { getOpenDecisionsSummary } from "@/features/decisions/service";
import * as repo from "./dashboard.repository";
import type { DashboardData, SectionResult } from "./dashboard-types";

// טעינת כל נתוני הדשבורד (P11): הרשאה אחת בראש, ואז כל תחום נטען בנפרד עם
// Promise.allSettled - כשל בתחום אחד (או תכונה של סוכן אחר שעדיין לא קיימת) לא מפיל את שאר הדשבורד.
export async function loadDashboardData(userId: string, projectId: string): Promise<DashboardData> {
  await requireProjectAccess(projectId, userId, "VIEW");

  const header = await repo.getProjectHeader(projectId);
  if (!header) {
    throw new NotFoundError("פרויקט");
  }

  const [decisions, budget, schedule, deliveries, changeRequests, issues, activity] = await Promise.allSettled([
    getOpenDecisionsSummary(userId, projectId),
    repo.getBudgetSummary(projectId),
    repo.getUpcomingPhases(projectId),
    repo.getUpcomingDeliveries(projectId),
    repo.getOpenChangeRequests(projectId),
    repo.getOpenIssues(projectId),
    repo.getRecentActivity(projectId),
  ]);

  return {
    header,
    openDecisions: toSection(decisions),
    budget: toSection(budget),
    schedule: toSection(schedule),
    deliveries: toSection(deliveries),
    changeRequests: toSection(changeRequests),
    issues: toSection(issues),
    activity: toSection(activity),
    isNewProject: header.status === "NEW",
  };
}

function toSection<T>(result: PromiseSettledResult<T>): SectionResult<T> {
  if (result.status === "fulfilled") {
    return { status: "ok", data: result.value };
  }
  console.error("[dashboard-section-error]", result.reason);
  return { status: "error" };
}
