'use client'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { createAppKit } from '@reown/appkit/react'
import '@mantine/core/styles.css'

import '@styles/app.css'
import '@styles/AwesomeButton.css'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  ethersAdapter,
  metadata,
  networks,
  projectId,
  wagmiAdapter
} from './config'
import Layout from '@components/Layout/index.js'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
// import {uiStore} from "@stores/ui.js";

const queryClient = new QueryClient()

createAppKit({
  adapters: [wagmiAdapter, ethersAdapter],
  projectId,
  metadata,
  networks,
  debug: true,
  features: {
    analytics: true
  }
})

// @ts-ignore
ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiProvider config={wagmiAdapter.wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  </WagmiProvider>
)
