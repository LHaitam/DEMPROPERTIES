import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Ton proxy actuel pour l'API PHP sur Hostinger
      "/api-inmo": {
        target: "https://lightslategrey-stork-838501.hostingersite.com",
        changeOrigin: true,
        secure: true,
        rewrite: (p: string) => p.replace(/^\/api-inmo/, ""),
      },
      // NOUVEAU : Proxy pour les vidéos Inmovilla
      "/media-inmo": {
        target: "https://media.inmovilla.com",
        changeOrigin: true,
        secure: true,
        rewrite: (p: string) => p.replace(/^\/media-inmo/, ""),
      },
    },
  },
});