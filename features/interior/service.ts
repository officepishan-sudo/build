import { requireProjectAccess } from "@/lib/auth/rbac";
import { NotFoundError } from "@/lib/errors";
import { interiorItemSchema, roomSchema } from "./schema";
import * as repo from "./repository";

export async function listRooms(userId: string, projectId: string) {
  await requireProjectAccess(projectId, userId, "VIEW");
  return repo.listRoomsWithItems(projectId);
}

export async function createRoom(userId: string, projectId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const data = roomSchema.parse(input);
  return repo.createRoom(projectId, data);
}

export async function updateRoom(userId: string, projectId: string, roomId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  const data = roomSchema.parse(input);
  await findExistingRoom(projectId, roomId);
  return repo.updateRoom(roomId, data);
}

export async function deleteRoom(userId: string, projectId: string, roomId: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  await findExistingRoom(projectId, roomId);
  return repo.deleteRoom(roomId);
}

export async function createItem(userId: string, projectId: string, roomId: string, input: unknown) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  await findExistingRoom(projectId, roomId);
  const data = interiorItemSchema.parse(input);
  return repo.createItem(roomId, data);
}

export async function updateItem(
  userId: string,
  projectId: string,
  roomId: string,
  itemId: string,
  input: unknown,
) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  await findExistingRoom(projectId, roomId);
  await findExistingItem(roomId, itemId);
  const data = interiorItemSchema.parse(input);
  return repo.updateItem(itemId, data);
}

export async function deleteItem(userId: string, projectId: string, roomId: string, itemId: string) {
  await requireProjectAccess(projectId, userId, "DECIDE");
  await findExistingRoom(projectId, roomId);
  await findExistingItem(roomId, itemId);
  return repo.deleteItem(itemId);
}

async function findExistingRoom(projectId: string, roomId: string) {
  const room = await repo.findRoomById(projectId, roomId);
  if (!room) throw new NotFoundError("חדר");
  return room;
}

async function findExistingItem(roomId: string, itemId: string) {
  const item = await repo.findItemById(roomId, itemId);
  if (!item) throw new NotFoundError("פריט");
  return item;
}
