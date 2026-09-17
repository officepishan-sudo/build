import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { phaseSchema, taskSchema } from "./schema";
import { movePhaseOrder } from "./scheduling";
import * as repo from "./repository";

export async function listScheduleBoard(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const [phases, professionals] = await Promise.all([
    repo.listPhasesWithTasks(projectId),
    repo.listProfessionalsForAssignment(),
  ]);
  return { phases, professionals };
}

export async function createPhase(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const data = phaseSchema.parse(input);
  const order = await repo.nextPhaseOrder(projectId);
  return repo.createPhase(projectId, data, order);
}

export async function updatePhase(userId: string, projectId: string, phaseId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await assertPhaseBelongsToProject(phaseId, projectId);
  const data = phaseSchema.parse(input);
  return repo.updatePhase(phaseId, data);
}

export async function deletePhase(userId: string, projectId: string, phaseId: string) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await assertPhaseBelongsToProject(phaseId, projectId);
  return repo.deletePhase(phaseId);
}

export async function movePhase(userId: string, projectId: string, phaseId: string, direction: "up" | "down") {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const phases = await repo.listPhasesWithTasks(projectId);
  const reordered = movePhaseOrder(phases, phaseId, direction);
  if (reordered === phases) return; // כבר בקצה - אין מה לעדכן
  await repo.updatePhaseOrders(reordered);
}

export async function createTask(userId: string, projectId: string, phaseId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await assertPhaseBelongsToProject(phaseId, projectId);
  const data = taskSchema.parse(input);
  return repo.createTask(projectId, phaseId, data);
}

export async function updateTask(userId: string, projectId: string, taskId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await assertTaskBelongsToProject(taskId, projectId);
  const data = taskSchema.parse(input);
  return repo.updateTask(taskId, data);
}

export async function deleteTask(userId: string, projectId: string, taskId: string) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  await assertTaskBelongsToProject(taskId, projectId);
  return repo.deleteTask(taskId);
}

async function assertPhaseBelongsToProject(phaseId: string, projectId: string) {
  const phase = await repo.findPhaseById(phaseId);
  if (!phase || phase.projectId !== projectId) {
    throw new NotFoundError("השלב");
  }
}

async function assertTaskBelongsToProject(taskId: string, projectId: string) {
  const task = await repo.findTaskById(taskId);
  if (!task || task.projectId !== projectId) {
    throw new NotFoundError("המשימה");
  }
  if (!task.phaseId) {
    throw new ValidationError("למשימה הזו אין שלב מקושר");
  }
}
