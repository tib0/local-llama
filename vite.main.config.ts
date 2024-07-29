import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: true,
    rollupOptions: {
      external: ["node-llama-cpp", "officeparser"],
    },
  },
  resolve: {
    conditions: ["node"],
    mainFields: ["module", "jsnext:main", "jsnext"],
  },
});
