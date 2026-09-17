import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError } from "@/lib/errors";
import { pinSchema, setBaseImageSchema } from "./schema";
import * as repo from "./repository";

export async function getCanvasState(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const [base, pins, requirements] = await Promise.all([
    repo.findCurrentBaseImageUrl(projectId),
    repo.listPins(projectId),
    repo.listProjectRequirements(projectId),
  ]);
  return { imageUrl: base?.imageUrl ?? null, pins, requirements };
}

export async function setBaseImage(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const data = setBaseImageSchema.parse(input);
  await repo.setBaseImageForAllPins(projectId, data.imageUrl);
  return data.imageUrl;
}

export async function createPin(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const data = pinSchema.parse(input);
  const base = await repo.findCurrentBaseImageUrl(projectId);
  return repo.createPin(projectId, base?.imageUrl ?? null, data);
}

export async function updatePin(userId: string, projectId: string, pinId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const data = pinSchema.parse(input);
  await findExistingPin(projectId, pinId);
  return repo.updatePin(pinId, data);
}

export async function deletePin(userId: string, projectId: string, pinId: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  await findExistingPin(projectId, pinId);
  return repo.deletePin(pinId);
}

async function findExistingPin(projectId: string, pinId: string) {
  const pin = await repo.findPinById(projectId, pinId);
  if (!pin) throw new NotFoundError("פין");
  return pin;
}
