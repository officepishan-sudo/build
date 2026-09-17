import { defineConfig } from "vitest/config";
import path from "node:path";

if (!process.env.TZ) process.env.TZ = "Asia/Jerusalem";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
  test: {
    environment: "node",
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    setupFiles: ["tests/setup.ts"],
    testTimeout: 15_000,
    hookTimeout: 30_000,
    restoreMocks: true,
    // כל קובץ בדיקה עושה TRUNCATE מלא ל-DB הבדיקות המשותף ב-beforeEach (tests/helpers/test-db.ts) -
    // הרצה מקבילית של כמה קבצים גורמת לקובץ אחד לאפס בדיוק כשקובץ אחר באמצע כתיבת ה-fixtures שלו
    // (FK violations אקראיים). עד שיוקם DB נפרד לכל worker, הרצה טורית היא הנכונה.
    fileParallelism: false,
  },
});
