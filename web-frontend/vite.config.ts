import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false, // Disable minification to reduce memory usage
    sourcemap: false, // Disable sourcemaps to reduce memory usage
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
    target: "es2015",
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
    cssCodeSplit: true,
    reportCompressedSize: false,
    esbuild: {
      logOverride: {
        "this-is-undefined-in-esm": "silent",
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
