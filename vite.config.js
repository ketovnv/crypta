import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import tauri from "vite-plugin-tauri";
import { viteStaticCopy } from "vite-plugin-static-copy";

// Плагин для анализа размера бандла
import { visualizer } from "rollup-plugin-visualizer";

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
    tsconfigPaths(),
    tauri(),
    viteStaticCopy({
      targets: [
        { src: "src-tauri/tauri.conf.json", dest: "." }, // Копируем конфиг Tauri
      ],
    }),
    visualizer({
      template: "treemap", // или "sunburst"
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "analyze.html", // будет создан в папке dist
    }),
  ],

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
    chunkSizeWarningLimit: 1500,
  },

  server: {
    port: 9222,
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
