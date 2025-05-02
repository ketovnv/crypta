import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import tauri from "vite-plugin-tauri";
import tailwindcssPlugin from 'vite-plugin-tailwindcss'


// Плагин для анализа размера бандла
import {visualizer} from "rollup-plugin-visualizer";

export default defineConfig({
  base: "./",
  plugins: [
    react({
      // Настраиваем Babel для работы с декораторами
      babel: {
        plugins: [
          [
            "@babel/plugin-proposal-decorators",
            {
              version: "2023-11",
              decoratorsBeforeExport: true, // Размещаем декораторы
              // перед export
            },
          ],
        ],
      },
    }),
    tailwindcssPlugin(),
    tsconfigPaths(),
    tauri(),
    visualizer({
      template: "treemap", // или "sunburst"
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "analyze.html", // будет создан в папке dist
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom'
  },
  resolve: {
    alias: {
      // Добавляем алиасы для удобства импортов
      "@": path.resolve(__dirname, "./src"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@animations": path.resolve(__dirname, "./src/animations"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },

  build: {
    target: "esnext",
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "mobx", "mobx-react-lite"],
          mantine: ["@mantine/core", "@mantine/hooks"],
          tauri: ["@tauri-apps/api"], // Выносим Tauri API
        },
      },
    },
    chunkSizeWarningLimit: 1750,
  },

  server: {
    port: 3000,
    strictPort: true,
    historyApiFallback: true,
    fs: {
      allow: [".."],
      strict: false,
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@tauri-apps/api", "@mantine/core", "mobx"],
    exclude: ["@babel/__generator__"],
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "0.0.1"),
    __IS_TAURI__: JSON.stringify(true), // Флаг для Tauri
  },
});
