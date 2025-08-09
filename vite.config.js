import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills"; // Use named import

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ["global"], // Add any other polyfills you need
    }),
  ],
});
