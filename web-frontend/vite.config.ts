import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    reportCompressedSize: false,
    cssCodeSplit: true,
    target: "es2015",
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // Reduce peak memory by limiting parallel processing
      maxParallelFileOps: 3,
      output: {
        // Split into smaller chunks so Rollup never holds the whole bundle in memory at once
        manualChunks(id) {
          // Core React runtime
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "react-core";
          }
          // Router
          if (
            id.includes("node_modules/react-router") ||
            id.includes("node_modules/@remix-run")
          ) {
            return "router";
          }
          // Radix UI primitives
          if (id.includes("node_modules/@radix-ui/")) {
            return "radix";
          }
          // MUI (very large - split from the rest)
          if (id.includes("node_modules/@mui/")) {
            return "mui";
          }
          // TanStack (react-query + react-table)
          if (id.includes("node_modules/@tanstack/")) {
            return "tanstack";
          }
          // Charts (recharts + d3)
          if (
            id.includes("node_modules/recharts") ||
            id.includes("node_modules/d3") ||
            id.includes("node_modules/victory")
          ) {
            return "charts";
          }
          // Firebase
          if (
            id.includes("node_modules/firebase") ||
            id.includes("node_modules/@firebase")
          ) {
            return "firebase";
          }
          // Monaco editor (very large)
          if (
            id.includes("node_modules/@monaco-editor") ||
            id.includes("node_modules/monaco-editor")
          ) {
            return "monaco";
          }
          // Audio / media
          if (
            id.includes("node_modules/howler") ||
            id.includes("node_modules/wavesurfer")
          ) {
            return "media";
          }
          // Forms + validation
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/zod") ||
            id.includes("node_modules/@hookform")
          ) {
            return "forms";
          }
          // Icons
          if (
            id.includes("node_modules/lucide-react") ||
            id.includes("node_modules/react-icons") ||
            id.includes("node_modules/@radix-ui/react-icons")
          ) {
            return "icons";
          }
          // HTTP + utilities
          if (
            id.includes("node_modules/axios") ||
            id.includes("node_modules/date-fns") ||
            id.includes("node_modules/clsx") ||
            id.includes("node_modules/class-variance-authority")
          ) {
            return "utils";
          }
          // Everything else from node_modules goes in vendor
          if (id.includes("node_modules/")) {
            return "vendor";
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    allowedHosts: ["localhost", ".abrar.computer"],
  },
  esbuild: {
    logOverride: {
      "this-is-undefined-in-esm": "silent",
    },
  },
});
