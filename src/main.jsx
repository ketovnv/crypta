"use client";
// import { invoke } from "@tauri-apps/api/core";

import React from "react";
import ReactDOM from "react-dom/client";

import "@mantine/core/styles.css";

import "@styles/app.css";
import "@styles/AwesomeButton.css";
import Layout from "@components/Layout/index.js";
import { logger } from "@stores/logger.js";

ReactDOM.createRoot(document.getElementById("root")).render(<Layout />);
// <WagmiProvider config={wagmiAdapter.wagmiConfig}>
//   <QueryClientProvider client={queryClient}>
