import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  base: "/",

  server: {
    proxy: {
      "/api": {
        target: "https://mediconnect-api.online",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
