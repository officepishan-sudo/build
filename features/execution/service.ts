import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError } from "@/lib/errors";
import { updateTaskStatusSchema } from "./schema";
import * as repo from "./repository";

export async function listExecutionOverview(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const [phases, documentsCount, expensesCount] = await Promise.all([
    repo.listPhasesWithTasks(projectId),
    repo.countProjectDocuments(projectId),
    repo.countProjectExpenses(projectId),
  ]);
  return { phases, documentsCount, expensesCount };
}

export async function updateTaskStatus(userId: string, projectId: string, taskId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const task = await repo.findTask(taskId);
  if (!task || task.projectId !== projectId) {
    throw new NotFoundError("משימה");
  }
  const { status } = updateTaskStatusSchema.parse(input);
  return repo.updateTaskStatus(taskId, status);
}
