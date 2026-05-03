import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // 🔥 PARA VERCEL (no usar el de GitHub Pages)
  base: "/",

  build: {
    rollupOptions: {
      external: ["fsevents"], // 🔥 evita el error en Vercel
    },
  },
});