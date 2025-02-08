import '@mantine/core/styles.css';
import {MantineProvider} from '@mantine/core';
import {Layout} from '@components/Layout';
import {theme} from './styles/theme.js';
import {createAppKit} from '@reown/appkit/react'
import {WagmiProvider} from 'wagmi'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {projectId, metadata, networks, wagmiAdapter} from './config'

const queryClient = new QueryClient()

//Web3 конфигурация
createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    metadata,
    networks
})





const App = () => <MantineProvider
    theme={theme}

>
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
            <Layout/>
        </QueryClientProvider>
    </WagmiProvider>
</MantineProvider>


export default App;


// import React, {Component} from 'react';
// import {observer} from 'mobx-react';
// import {RouterStore, syncHistoryWithStore} from '@ibm/mobx-react-router';
// import {createBrowserHistory} from 'history';
//
// const routerStore = new RouterStore();
// const browserHistory = createBrowserHistory();
// const history = syncHistoryWithStore(browserHistory, routerStore);
//
// import {createAppKit} from '@reown/appkit/react'
//
// //
// // import {WagmiProvider} from 'wagmi'
// //
// // import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
// // import {ActionButtonList} from './components/ActionButtonList'
// // import {InfoList} from './components/InfoList'
// import {projectId, metadata, networks, wagmiAdapter} from './config'
//

// import {useFullscreen} from "@mantine/hooks";
// import {
//     Button,
//     Center,
//     Container,
//     Mark,
//     Text,
//     Highlight,
//     Paper,
//     AppShell,
//     Burger,
//     Group,
//     useMantineColorScheme
// } from "@mantine/core";
// import {uiStore} from "./stores/ui.js";
// import {Router} from "react-router";
// import {HomePage} from "@/Pages/Home.page.jsx";
//
// // const queryClient = new QueryClient()
//
// // Web3 конфигурация
// // createAppKit({
// //     adapters: [wagmiAdapter],
// //     projectId,
// //     metadata,
// //     networks
// // })
//
//
// @observer
// export default class App extends Component {
//     render() {
//         // const {toggle, fullscreen} = useFullscreen();
//
//         const { colorScheme, setColorScheme } = useMantineColorScheme();
//
//         // const toggleColorScheme = () => {
//         //     setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
//         // };
//
//         const { history,isBurgerOpened,routing } = uiStore;
//         const demoProps = {
//             bg: 'var(--mantine-color-blue-light)',
//             mt: 'md',
//         };
//         return (
//             <AppShell
//                 header={{height: 60}}
//                 navbar={{
//                     width: 300,
//                     breakpoint: 'sm',
//                     collapsed: {mobile: !isBurgerOpened},
//                 }}
//                 padding="md"
//             >
//                 <AppShell.Header>
//                     <Burger
//                         opened={isBurgerOpened}
//                         onClick={()=>uiStore.toggleBurger()}
//                         hiddenFrom="sm"
//                         size="sm"
//                     />
//                     <div>Logo</div>
//                     {/*<div>*/}
//                     {/*    <h2>React FFS</h2>*/}
//                     {/*    <FPSStats />*/}
//                     {/*</div>*/}
//                     <Group>
//                         <Button onClick={() => setColorScheme('light')}>Light</Button>
//                         <Button onClick={() => setColorScheme('dark')}>Dark</Button>
//                         <Button onClick={() => setColorScheme('auto')}>Auto</Button>
//                     </Group>
//                 </AppShell.Header>
//                 <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
//
//                 <AppShell.Main>
//                     {/*<Router location={routing.location} navigator={history}>*/}
//                         <Center>
//                             <Container size="xs" {...demoProps}>
//                                 <Highlight
//                                     ta="center"
//                                     highlight={['highlighted', 'default']}
//                                     highlightStyles={{
//                                         backgroundImage:
//                                             'linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))',
//                                         fontWeight: 700,
//                                         WebkitBackgroundClip: 'text',
//                                         WebkitTextFillColor: 'transparent',
//                                     }}
//                                 >
//                                     You can change styles of highlighted part if you do not like default styles
//                                 </Highlight>
//                                 <Button  variant="gradient"
//                                          gradient={{ from: 'cyan', to: 'blue', deg: 90 }}>Mantine button</Button>
//                                 <img src="/assets/react.svg" alt="React" style={{width: '150px', height: '150px'}}/>
//                                 <span>Current pathname: {uiStore.getLocation}</span>
//                                 <Button variant="gradient"
//                                         gradient={{ from: 'blue', to: 'cyan', deg: 90 }} onClick={() => history.push('/test')}>Change url</Button>
//                                 <Button  variant="gradient"
//                                          gradient={{ from: 'yellow', to: 'orange', deg: 90 }}
//                                          onClick={() => history.back()}>Go Back</Button>
//                             </Container>
//                         </Center>
//                     {/*</Router>*/}
//                 </AppShell.Main>
//             </AppShell>
//         );
//     }
// }
// <div className="container mx-auto px-4 py-10">


{/*<div className="pt-8 text-base text-slate-800">onChange value: {value}</div>*/
}
{/*<div className="text-base text-slate-800">onChangeEnd value:{endValue}</div>*/
}

{/*<Button onClick={toggle} color={fullscreen ? 'red' : 'blue'}>*/
}
{/*    {fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}*/
}
{/*</Button>*/
}

// <WagmiProvider config={wagmiAdapter.wagmiConfig}>
//     <QueryClientProvider client={queryClient}>

//
// <ActionButtonList/>
// <InfoList/>