/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__test__/setup.ts",
    css: true,
    reporters: ["default", "json"],
    outputFile: "./reports/test-summery.json",

    // Limiting the scope of Vitest to `src` directory
    include: ["src/**/*.spec.tsx"],

    coverage: {
      provider: "v8",
      include: ["src/**/*"],
      reporter: ["text", "json-summary"],
      reportsDirectory: "./reports/",
    },
  },
});
