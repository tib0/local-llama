import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["node-llama-cpp"],
    },
  },
  resolve: {
    conditions: ["node"],
    mainFields: ["module", "jsnext:main", "jsnext"],
  },
});
