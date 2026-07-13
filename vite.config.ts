import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

// Vanilla SPA (React + Vite). No SSR.
// Native Federation is wired at build time via `federation.config.js` and the
// `@softarc/native-federation` build tooling; in dev we run a standard Vite
// server so the Lovable sandbox preview keeps working on port 8080.
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
  },
  preview: {
    host: "::",
    port: 8080,
    strictPort: true,
  },
});
