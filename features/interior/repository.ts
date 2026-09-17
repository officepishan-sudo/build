import { prisma } from "@/lib/prisma";
import type { InteriorItemInput, RoomInput } from "./schema";

export function listRoomsWithItems(projectId: string) {
  return prisma.room.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    include: { items: { orderBy: { createdAt: "asc" } } },
  });
}

export function findRoomById(projectId: string, roomId: string) {
  return prisma.room.findFirst({ where: { id: roomId, projectId } });
}

export function createRoom(projectId: string, data: RoomInput) {
  return prisma.room.create({ data: { projectId, name: data.name, notes: data.notes } });
}

export function updateRoom(roomId: string, data: RoomInput) {
  return prisma.room.update({ where: { id: roomId }, data: { name: data.name, notes: data.notes } });
}

export function deleteRoom(roomId: string) {
  return prisma.room.delete({ where: { id: roomId } });
}

export function findItemById(roomId: string, itemId: string) {
  return prisma.interiorItem.findFirst({ where: { id: itemId, roomId } });
}

export function createItem(roomId: string, data: InteriorItemInput) {
  return prisma.interiorItem.create({
    data: {
      roomId,
      category: data.category,
      decisionText: data.decisionText,
      quantity: data.quantity,
      productId: data.productId,
    },
  });
}

export function updateItem(itemId: string, data: InteriorItemInput) {
  return prisma.interiorItem.update({
    where: { id: itemId },
    data: {
      category: data.category,
      decisionText: data.decisionText,
      quantity: data.quantity,
      productId: data.productId,
    },
  });
}

export function deleteItem(itemId: string) {
  return prisma.interiorItem.delete({ where: { id: itemId } });
}

// קריאה בלבד: Product/Supplier שייכים לפיצ'ר suppliers (סוכן אחר) - כאן רק לתצוגת שם מקושר.
export function findProductSummary(productId: string) {
  return prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, name: true, supplier: { select: { name: true } } },
  });
}
