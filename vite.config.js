import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "@babel/plugin-proposal-decorators",
            {
              version: "2023-05",
            },
          ],
        ],
      },
    }),
    {
      tsconfigPaths: {},
      autoprefixer: {},
    },
  ],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@stores": "/src/stores",
    },
  },
  server: {
    port: 3000, // или любой другой свободный порт
  },
});
