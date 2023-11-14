import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    coverage: {
      provider: "v8",
      enabled: true, // show coverage when run vitest:ui
    },
    restoreMocks: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/"),
    },
  },
});
