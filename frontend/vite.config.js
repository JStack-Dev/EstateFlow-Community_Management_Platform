import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // 🔥 FIJO para GitHub Pages (producción real)
  base: "/EstateFlow-Community_Management_Platform/",
});