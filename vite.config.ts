import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    host: true, // Agar bisa diakses dari IP lain
    port: 80, // Mengubah port menjadi 80
    strictPort: true, // Agar tidak pindah ke port lain jika 80 dipakai
  },
});
