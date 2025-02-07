import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Плагин для анализа размера бандла
import {visualizer} from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [
        react({
            // Настраиваем Babel для работы с декораторами
            babel: {
                plugins: [
                    ["@babel/plugin-proposal-decorators",
                        {
                            legacy: false,  // Используем современный синтаксис декораторов
                            decoratorsBeforeExport: true  // Размещаем декораторы перед export
                        }
                    ]
                ]
            }
        }),
        visualizer({
            template: "treemap", // или "sunburst"
            open: true,
            gzipSize: true,
            brotliSize: true,
            filename: "analyze.html", // будет создан в папке dist
        })
    ],

    resolve: {
        alias: {
            // Добавляем алиасы для удобства импортов
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@mantinex': path.resolve(__dirname, 'node_modules/@mantinex')
        }
    },

    build: {
        // Оптимизация production сборки
        target: 'esnext', // используем современные браузеры
        minify: 'esbuild', // используем esbuild для минификации
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Группируем все модули @mantinex в один чанк
                    if (id.includes('@mantinex')) {
                        return 'mantinex-bundle';
                    }
                    // Если модуль из node_modules, но не @mantinex
                    if (id.includes('node_modules')) {
                        if (id.includes('@mantine/core')) {
                            return 'mantine-core';
                        }
                        if (id.includes('react')) {
                            return 'react-vendor';
                        }
                        return 'vendors';
                    }
                }
            }
        },
        // Включаем source maps только если нужно
        sourcemap: false,
        // Оптимизируем размер
        chunkSizeWarningLimit: 1000,
    },

    server: {
        port: 3000,
        // Оптимизация режима разработки
        hmr: {
            overlay: true, // показывать ошибки поверх приложения
        },
        // Если нужен hot reload для стилей
        watch: {
            usePolling: true,
        },
        fs: {
            // Разрешаем загрузку модулей из node_modules
            allow: ['..']
        }
    },

    // Оптимизация зависимостей
    optimizeDeps: {
        // Предварительно бандлим все компоненты @mantinex
        include: [
            '@mantinex/mantine-header',
            '@mantinex/mantine-logo',
            '@mantinex/mantine-meta',
            '@mantinex/dev-icons',
            '@mantinex/shiki'
        ],
        // Настройки для более эффективной сборки
        esbuildOptions: {
            target: 'esnext'
        }
    },

});