"use client";
import React from "react";
import ReactDOM from "react-dom/client";

import { createAppKit } from "@reown/appkit/react";
import "@mantine/core/styles.css";
import "@styles/app.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "./styles/theme.js";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { metadata, networks, projectId, wagmiAdapter } from "./config";
import { loggerStore } from "@/stores/logger";
import Layout from "@components/Layout/index.js";

const queryClient = new QueryClient();

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  metadata,
  networks,
  features: {
    analytics: true,
  },
});

function Root() {
  loggerStore.success("🖥️", "Приложение запущено! 🖥️");
  return (
    <MantineProvider theme={theme}>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Layout />
        </QueryClientProvider>
      </WagmiProvider>
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
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
