import {defineConfig} from 'vite';
import react          from '@vitejs/plugin-react';
import path           from 'path';
import svgr           from "vite-plugin-svgr";
import tsconfigPaths  from "vite-tsconfig-paths";


// Плагин для анализа размера бандла
import {visualizer} from 'rollup-plugin-visualizer';

export default defineConfig({
                                plugins: [
                                    react({
                                              // Настраиваем Babel для работы с декораторами
                                              babel: {
                                                  plugins: [
                                                      [
                                                          "@babel/plugin-proposal-decorators",
                                                          {
                                                              version: "2023-11",
                                                              decoratorsBeforeExport: true,  // Размещаем декораторы
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
                                    svgr({
                                             svgrOptions: {
                                                 plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
                                                 svgoConfig: {
                                                     plugins: [
                                                         {
                                                             name: 'preset-default',
                                                             params: {
                                                                 overrides: {
                                                                     cleanupIds: false,
                                                                     inlineStyles: {onlyMatchedOnce: false},
                                                                     removeViewBox: false, // Preserve viewBox
                                                                 },
                                                             },
                                                         },
                                                         'convertColors', // Additional color optimization
                                                         'prefixIds'],
                                                     'floatPrecision': 2,
                                                 },
                                                 // esbuild options, to transform jsx to js
                                                 esbuildOptions: {
                                                     // ...
                                                 },
                                                 exportType: "default",
                                                 ref: true,
                                                 svgo: true,
                                                 titleProp: true,
                                                 // A minimatch pattern, or array of patterns, which specifies the
                                                 // files in the build the plugin should include.
                                                 include: "**/*.svg",
                                                 exclude: "",
                                             },
                                             // ...
                                         }),
                                ],

                                resolve: {
                                    alias: {
                                        // Добавляем алиасы для удобства импортов
                                        '@': path.resolve(__dirname, './src'),
                                        '@styles': path.resolve(__dirname, './src/styles'),
                                        '@stores': path.resolve(__dirname, './src/stores'),
                                        '@components': path.resolve(__dirname, './src/components'),
                                        '@animations': path.resolve(__dirname, './src/animations'),
                                        '@assets': path.resolve(__dirname, './src/assets'),
                                    },
                                },

                                build: {
                                    // Оптимизация production сборки
                                    target: 'esnext', // используем современные браузеры
                                    minify: 'esbuild', // используем esbuild для минификации
                                    rollupOptions: {
                                        output: {
                                            manualChunks: {
                                                'vendor': ['react', 'react-dom'],
                                                'mantine': ['@mantine/core', '@mantine/hooks'],
                                            },
                                        },
                                    },
                                    // Включаем source maps только если нужно
                                    sourcemap: false,
                                    // Оптимизируем размер
                                    chunkSizeWarningLimit: 1000,
                                },

                                server: {
                                    port: 6500,
                                    strictPort: true,
                                    historyApiFallback: true,
                                    hmr: false,
                                    watch: {
                                        usePolling: true,
                                    },
                                    fs: {
                                        allow: ['..'],  // Разрешаем доступ к родительской директории
                                        strict: false   // Отключаем строгую проверку
                                    },
                                    cors: {
                                        origin: 'http://localhost:6500',
                                        credentials: true,
                                        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                                        allowedHeaders: ['Content-Type', 'Authorization']
                                    }
                                },
                                // Оптимизация зависимостей
                                optimizeDeps: {
                                    // Предварительно бандлим все компоненты @mantinex
                                    include: ['react', 'react-dom', '@mantine/core', '@mantine/hooks'],
                                    // Настройки для более эффективной сборки
                                    esbuildOptions: {
                                        target: 'esnext',
                                    },
                                },

                            });
