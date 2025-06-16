import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import tauri from "vite-plugin-tauri";
import webfontDownload from "vite-plugin-webfont-dl";
// import requirePlugin from "vite-plugin-require";
import tailwindcss from "@tailwindcss/vite";
// import tailwindcssPlugin from 'vite-plugin-tailwindcss'

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
    // reactSWC({
    //   // Опции для SWC, если нужны
    //   // Например, для поддержки декораторов MobX
    //   devTarget: "esnext",
    //   useAtYourOwnRisk_mutateSwcOptions(options) {
    //     options.jsc.parser.decorators = true;
    //     options.jsc.transform.decoratorVersion = "2022-03";
    //   },
    // }),
    webfontDownload([
      // 'https://fonts.googleapis.com/css2?family=Sofia+Sans:ital,wght@0,1..1000;1,1..1000&display=swap',
      "https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700",
      "https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap",
      "https://fonts.googleapis.com/css2?family=Chivo+Mono:ital,wght@0,100..900;1,100..900",
    ]),
    // requirePlugin(),
    tailwindcss(),
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
  clearScreen: false,
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      // Добавляем алиасы для удобства импортов
      "@": path.resolve(__dirname, "./src"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@animations": path.resolve(__dirname, "./src/animations"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },

  build: {
    minify: "esbuild",
    target: "esnext",
    esbuildOptions: {
      legalComments: "none",
      treeShaking: true,
    },
    emptyOutDir: true,
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "mobx", "mobx-react-lite"],
          mantine: ["@mantine/core", "@mantine/hooks"],
          tauri: ["@tauri-apps/api"],
        },
      },
    },
    chunkSizeWarningLimit: 1750,
  },

  server: {
    open: false,
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
