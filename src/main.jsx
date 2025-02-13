import React                                         from 'react';
import '@mantine/core/styles.css';
import {MantineProvider, ColorSchemeScript}          from '@mantine/core';
import {theme}                                       from './styles/theme.js';
import {createAppKit}                                from '@reown/appkit/react'
import {WagmiProvider}                               from 'wagmi'
import {QueryClient, QueryClientProvider}            from '@tanstack/react-query'
import {projectId, metadata, networks, wagmiAdapter} from './config'
//import { errorHandlerService } from './components/Pages/ErrorNotifications/ErrorHandlerService';
//import { GlobalErrorDisplay  } from './components/Pages/ErrorNotifications/GlobalErrorDisplay';
// Инициализируем обработчики ошибок до рендеринга приложения
//errorHandlerService.initialize();

const queryClient = new QueryClient()
import ReactDOM                                      from "react-dom/client"

//Web3 конфигурация
createAppKit({
                 adapters: [wagmiAdapter],
                 projectId,
                 metadata,
                 networks,
             })
import {
    createBrowserRouter,
    RouterProvider,
}               from 'react-router-dom'
import {routes} from '@components/Pages/routes.tsx'

const router = createBrowserRouter(routes)


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ColorSchemeScript defaultColorScheme="dark" />
        <MantineProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiAdapter.wagmiConfig}>
                    <RouterProvider router={router} />
                    {/*<GlobalErrorDisplay/>*/}
                </WagmiProvider>
            </QueryClientProvider>
        </MantineProvider>
    </React.StrictMode>
)


