import React, { Component }  from 'react';
import { inject, observer } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from '@ibm/mobx-react-router';
import { createBrowserHistory } from 'history';

const routerStore = new RouterStore();
const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, routerStore);

import { createAppKit } from '@reown/appkit/react'

iimport { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ActionButtonList } from './components/ActionButtonList'
import { InfoList } from './components/InfoList'
import { projectId, metadata, networks, wagmiAdapter } from './config'

import "./App.css"

const queryClient = new QueryClient()

// Web3 конфигурация
createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    metadata,
    networks
})



@observer
export default class App extends Component {
    render() {

        return (
            <div>
                <span>Current pathname: {location.pathname}</span>
                <button onClick={() => push('/test')}>Change url</button>
                <button onClick={() => back()}>Go Back</button>
            </div>
        );
    }

// export function App() {
//
//   return (
//     <div className={"pages"}>
//       <img src="/reown.svg" alt="Reown" style={{ width: '150px', height: '150px' }} />
//       <h1>AppKit Wagmi React dApp Example</h1>
//       <WagmiProvider config={wagmiAdapter.wagmiConfig}>
//         <QueryClientProvider client={queryClient}>
//             <appkit-button />
//             <ActionButtonList />
//             <InfoList />
//         </QueryClientProvider>
//       </WagmiProvider>
//     </div>
//   )
// }

export default App
