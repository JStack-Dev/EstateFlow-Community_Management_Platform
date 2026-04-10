import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],

    // 🔥 IMPORTANTE:
    // En producción (GitHub Pages) usamos la ruta del repo
    // En desarrollo usamos "/"
    base:
      mode === "production"
        ? "/EstateFlow-Community_Management_Platform/"
        : "/",
  };
});