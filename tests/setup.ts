import { beforeEach } from "vitest";
import { assertTestDatabaseUrl, resetDb } from "./helpers/test-db";

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
process.env.SESSION_SECRET ??= "test-only-session-secret-00000000000000000000";

assertTestDatabaseUrl(process.env.DATABASE_URL);

beforeEach(async () => {
  await resetDb();
});
