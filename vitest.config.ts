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
  },
});
