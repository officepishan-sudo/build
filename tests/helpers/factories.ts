import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";

export async function createTestUser(overrides: { email?: string; name?: string } = {}) {
  return prisma.user.create({
    data: {
      email: overrides.email ?? `user-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
      name: overrides.name ?? "משתמש בדיקה",
      passwordHash: await hashPassword("Password123!"),
    },
  });
}

export async function createTestProject(ownerId: string, overrides: { name?: string } = {}) {
  return prisma.project.create({
    data: {
      ownerId,
      name: overrides.name ?? "פרויקט בדיקה",
      type: "RENOVATION",
    },
  });
}
