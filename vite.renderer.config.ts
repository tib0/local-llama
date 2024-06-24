import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    minify: true,
    chunkSizeWarningLimit: 800,
  },
  plugins: [react(), tsconfigPaths()],
});
