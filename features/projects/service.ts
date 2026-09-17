import { requireProjectAccess } from "@/lib/auth/rbac";
import { createProjectSchema, pauseProjectSchema } from "./schema";
import * as repo from "./repository";

export async function listMyProjects(userId: string) {
  return repo.listProjectsForUser(userId);
}

export async function createProject(userId: string, input: unknown) {
  const data = createProjectSchema.parse(input);
  return repo.createProject(userId, data);
}

export async function pauseProject(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  const data = pauseProjectSchema.parse(input);
  return repo.pauseProject(projectId, data.reason);
}

export async function resumeProject(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "MANAGE");
  return repo.resumeProject(projectId);
}

export async function getExistingProjectIntake(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.getProjectExistingStateSummary(projectId);
}
