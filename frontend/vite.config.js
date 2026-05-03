import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/EstateFlow-Community_Management_Platform/",
  plugins: [react()],

  build: {
    target: "esnext",
    rollupOptions: {
      external: [
        "fsevents",
        "path",
        "fs",
        "module",
        "postcss"
      ],
    },
  },
});