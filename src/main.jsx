"use client";
import { invoke } from "@tauri-apps/api/core";

invoke("start_bun_log_server");
import React from "react";
import ReactDOM from "react-dom/client";

import { createAppKit } from "@reown/appkit/react";
import "@mantine/core/styles.css";

import "@styles/app.css";
import "@styles/AwesomeButton.css";

// Импортируем console logger для перехвата логов
import "@utils/console-logger.js";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ethersAdapter,
  metadata,
  networks,
  projectId,
  wagmiAdapter,
} from "./config";
import Layout from "@components/Layout/index.js";
import { logger } from "@stores/logger.js";

const queryClient = new QueryClient();

logger.info(1);
createAppKit({
  adapters: [wagmiAdapter, ethersAdapter],
  projectId,
  metadata,
  networks,
  debug: true,
  features: {
    analytics: true,
  },
});
logger.info(2);
// @ts-ignore

ReactDOM.createRoot(document.getElementById("root")).render(
  <WagmiProvider config={wagmiAdapter.wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  </WagmiProvider>,
);
