"use client";
import React, {Profiler}                             from 'react';
import ReactDOM                                      from "react-dom/client";
import '@mantine/core/styles.css';
import '/src/styles/app.css';
import {MantineProvider, ColorSchemeScript}          from '@mantine/core';
import {theme}                                       from './styles/theme.js';
import {createAppKit}                                from '@reown/appkit/react';
import {WagmiProvider}                               from 'wagmi';
import {QueryClient, QueryClientProvider}            from '@tanstack/react-query';
import {createBrowserRouter, RouterProvider}         from 'react-router-dom';
import {projectId, metadata, networks, wagmiAdapter} from './config';
import {routes}                                      from '@components/Pages/routes.tsx';


// Создаем экземпляры один раз вне компонента
const queryClient = new QueryClient();
const router = createBrowserRouter(routes);





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

    return (

        <MantineProvider theme={theme}>

            <WagmiProvider config={wagmiAdapter.wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    {/*<Profiler id="Layout" onRender={(id, phase, actualDuration) => {*/}
                    {/*    console.log(`${id} rendered in ${phase} phase for ${actualDuration}ms`);*/}
                    {/*}}>*/}
                            <RouterProvider router={router} />
                    {/*</Profiler>*/}
                </QueryClientProvider>
            </WagmiProvider>
        </MantineProvider>

    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    // В продакшене можно оставить StrictMode
    process.env.NODE_ENV === 'production' ? (
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