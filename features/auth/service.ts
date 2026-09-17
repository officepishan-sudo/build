import { ConflictError, ValidationError } from "@/lib/errors";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSessionCookie } from "@/lib/auth/session";
import { loginSchema, registerSchema } from "./schema";
import * as repo from "./repository";

export async function login(input: unknown) {
  const data = loginSchema.parse(input);
  const user = await repo.findUserByEmail(data.email);
  if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
    throw new ValidationError("אימייל או סיסמה שגויים", { email: ["אימייל או סיסמה שגויים"] });
  }
  await createSessionCookie({ userId: user.id, email: user.email, name: user.name });
  return { id: user.id, name: user.name };
}

export async function register(input: unknown) {
  const data = registerSchema.parse(input);
  const existing = await repo.findUserByEmail(data.email);
  if (existing) {
    throw new ConflictError("כבר קיים משתמש עם האימייל הזה");
  }
  const passwordHash = await hashPassword(data.password);
  const user = await repo.createUser({
    email: data.email,
    passwordHash,
    name: data.name,
    phone: data.phone,
  });
  await createSessionCookie({ userId: user.id, email: user.email, name: user.name });
  return { id: user.id, name: user.name };
}
