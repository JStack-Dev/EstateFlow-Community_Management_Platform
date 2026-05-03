import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  base: "/",

  resolve: {
    alias: {
      fsevents: false, // 🔥 BLOQUEA totalmente el módulo
    },
  },

  optimizeDeps: {
    exclude: ["fsevents"], // 🔥 evita que Vite lo procese
  },

  build: {
    rollupOptions: {
      external: ["fsevents"], // 🔥 seguridad extra
    },
  },
});