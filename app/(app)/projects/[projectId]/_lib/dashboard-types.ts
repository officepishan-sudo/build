import type { ChangeRequest, Delivery, Issue, Phase, Project } from "@prisma/client";

// טיפוסי הנתונים המורכבים עבור דשבורד הפרויקט (P11).
// כל סקציה יכולה להיכשל בנפרד (Promise.allSettled) - לכן "status" מציין הצלחה/כשל לכל סקציה.

export type SectionResult<T> = { status: "ok"; data: T } | { status: "error" };

export type ProjectHeaderData = Pick<
  Project,
  "id" | "name" | "type" | "status" | "pausedReason" | "createdAt" | "updatedAt"
>;

export type BudgetSummaryData = {
  plannedTotal: number;
  committedTotal: number;
  actualTotal: number;
  paidTotal: number;
  lineCount: number;
};

export type ActivityItem = {
  id: string;
  kind: "document" | "photo" | "message";
  label: string;
  at: Date;
};

export type DashboardData = {
  header: ProjectHeaderData;
  openDecisions: SectionResult<{ count: number; items: { id: string; title: string; deadline: Date | null }[] }>;
  budget: SectionResult<BudgetSummaryData>;
  schedule: SectionResult<Phase[]>;
  deliveries: SectionResult<Delivery[]>;
  changeRequests: SectionResult<{ count: number; items: ChangeRequest[] }>;
  issues: SectionResult<{ count: number; items: Issue[] }>;
  activity: SectionResult<ActivityItem[]>;
  isNewProject: boolean;
};
