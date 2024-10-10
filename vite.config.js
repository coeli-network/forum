// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      "@": "./vite_assets",
    },
  },
  root: "./vite_assets",
  base: "/static/",
  build: {
    manifest: "manifest.json",
    emptyOutDir: true,
    target: "es2015", // or any other target suitable for your browser support
    outDir: "../vite_assets_dist",
    rollupOptions: {
      input: {
        home: "vite_assets/js/main.js",
      },
      output: {
        format: "iife",
        entryFileNames: "bundle.js",
      },
    },
  },
});
