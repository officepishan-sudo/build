import { prisma } from "@/lib/prisma";
import type { DecisionStatus } from "@prisma/client";
import type { CreateDecisionInput } from "./schema";

export function listDecisionsByProject(projectId: string) {
  return prisma.decision.findMany({
    where: { projectId },
    orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
  });
}

export function listOpenDecisions(projectId: string, take?: number) {
  return prisma.decision.findMany({
    where: { projectId, status: "OPEN" },
    orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
    take,
  });
}

export function countOpenDecisions(projectId: string) {
  return prisma.decision.count({ where: { projectId, status: "OPEN" } });
}

export function findDecisionById(projectId: string, decisionId: string) {
  return prisma.decision.findFirst({ where: { id: decisionId, projectId } });
}

export function createDecision(projectId: string, data: CreateDecisionInput) {
  return prisma.decision.create({
    data: {
      projectId,
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      dependsOn: data.dependsOn,
    },
  });
}

export function updateDecisionStatus(
  decisionId: string,
  data: { status: DecisionStatus; decidedValue: string | null; decidedAt: Date | null },
) {
  return prisma.decision.update({ where: { id: decisionId }, data });
}
