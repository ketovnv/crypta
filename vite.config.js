import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

// Плагин для анализа размера бандла
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  base: './',
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
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mantine: ["@mantine/core", "@mantine/hooks"],
        },
      },
    },
    
    sourcemap: false,
    // Оптимизируем размер
    chunkSizeWarningLimit: 1000,
  },

  server: {
    port: 9222,
    strictPort: true,
    historyApiFallback: true,
    fs: {
      allow: [".."], 
      strict: false, 
    }
  },
  optimizeDeps: {   
    include: ["react", "react-dom", "@mantine/core", "@mantine/hooks", "@loadable/component"],
    esbuildOptions: {
      target: "esnext",
    },
  },
});
