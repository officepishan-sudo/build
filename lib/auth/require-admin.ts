import { ForbiddenError } from "@/lib/errors";
import { isUserAdmin } from "@/lib/db/admin-access";
import { requireSession, type SessionPayload } from "./session";

export async function requireAdminSession(): Promise<SessionPayload> {
  const session = await requireSession();
  if (!(await isUserAdmin(session.userId))) {
    throw new ForbiddenError("מסך זה זמין למנהלי מערכת בלבד");
  }
  return session;
}
