import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError } from "@/lib/errors";
import { addPhotoSchema, editPhotoSchema } from "./schema";
import * as repo from "./repository";

export async function listPhotos(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listPhotosByProject(projectId);
}

export async function listPhases(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listPhasesForProject(projectId);
}

export async function getPhoto(userId: string, projectId: string, photoId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  const photo = await repo.findPhotoById(projectId, photoId);
  if (!photo) throw new NotFoundError("תמונה");
  return photo;
}

export async function addPhoto(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "COMMENT");
  const data = addPhotoSchema.parse(input);
  return repo.createPhoto(projectId, data);
}

// עריכה מפורשת בלבד - אף פעולה אחרת לא משנה phaseId של תמונה קיימת כתופעת לוואי.
export async function editPhoto(userId: string, projectId: string, photoId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "COMMENT");
  const existing = await repo.findPhotoById(projectId, photoId);
  if (!existing) throw new NotFoundError("תמונה");
  const data = editPhotoSchema.parse(input);
  return repo.updatePhoto(photoId, data);
}
