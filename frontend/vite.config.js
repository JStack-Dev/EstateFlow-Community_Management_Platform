import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/EstateFlow-Community_Management_Platform/",
  plugins: [react()],

  define: {
    global: "window",
  },

  resolve: {
    conditions: ["browser"],
  },

  optimizeDeps: {
    exclude: ["fsevents"],
  },

  build: {
    rollupOptions: {
      external: ["fsevents"],
    },
    commonjsOptions: {
      ignoreTryCatch: false,
    },
  },
});