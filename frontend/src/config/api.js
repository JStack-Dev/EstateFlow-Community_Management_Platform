import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // 🔥 CLAVE PARA VERCEL
  base: "/",
});