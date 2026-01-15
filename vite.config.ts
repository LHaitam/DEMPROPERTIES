import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// On utilise defineConfig pour avoir l'autocomplétion et le typage
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Utilisation de path.resolve pour l'alias @
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api-inmo": {
        target: "https://lightslategrey-stork-838501.hostingersite.com",
        changeOrigin: true,
        secure: true,
        // Correction de l'erreur TS7006 (Implicit any) en typant l'argument p
        rewrite: (p: string) => p.replace(/^\/api-inmo/, ""),
      },
    },
  },
});