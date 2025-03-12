"use client";
import React from "react";
import ReactDOM from "react-dom/client";

import { createAppKit  } from "@reown/appkit/react";
import "@mantine/core/styles.css";
import "@styles/app.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "./styles/theme.js";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { projectId, metadata, networks, wagmiAdapter } from "./config";

// Создаем экземпляры один раз вне компонента
const queryClient = new QueryClient();

import { loggerStore } from "@/stores/logger";
import Layout from "@components/Layout/index.js";

// Инициализируем AppKit один раз
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  metadata,
  networks,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

// Создаем корневой компонент для лучшей организации провайдеров
function Root() {
    loggerStore.success("🖥️", "Приложение запущено! 🖥️");
  console.log(1)  
  return (
    <MantineProvider theme={theme}>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Layout/>
        </QueryClientProvider>
      </WagmiProvider>
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  // В продакшене можно оставить StrictMode
  process.env.NODE_ENV === "production" ? (
    <React.StrictMode>
      <ColorSchemeScript defaultColorScheme="dark" />
    </React.StrictMode>
  ) : (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <Root />
    </>
  ),
);
