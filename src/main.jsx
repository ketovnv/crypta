"use client";
import React from "react";
import ReactDOM from "react-dom/client";

import {createAppKit} from "@reown/appkit/react";
import "@mantine/core/styles.css";

import "@styles/app.css";
import "@styles/AwesomeButton.css";
import {ColorSchemeScript, MantineProvider} from "@mantine/core";
import {theme} from "./styles/theme.js";
import {WagmiProvider} from "wagmi";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {metadata, networks, projectId, wagmiAdapter} from "./config";
import Layout from "@components/Layout/index.js";
import {logger} from "@stores/logger.js";
import {uiStore} from "@stores/ui.js";
// import {uiStore} from "@stores/ui.js";

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
logger.info(uiStore.colorScheme)
// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
    <MantineProvider theme={theme}>
      <ColorSchemeScript defaultColorScheme='dark' forceColorScheme="dark"/>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Layout />
        </QueryClientProvider>
      </WagmiProvider>
    </MantineProvider>
);
