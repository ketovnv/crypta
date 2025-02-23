// src/stores/WalletStore.ts
import {makeAutoObservable, flow, reaction, runInAction} from 'mobx';
import {
    useAppKit,
    useAppKitNetwork,
    useAppKitState,
    useAppKitAccount,
    useWalletInfo,
    useDisconnect
} from '@reown/appkit/react';
import {useReadContract, useWriteContract} from 'wagmi';
import {networks} from '../config';

import type {ConnectionStatus,PublicStateControllerState} from '@reown/appkit-core';
import type {CaipNetwork, CaipAddress, Balance} from '@reown/appkit-common';
import type {Event} from '@reown/appkit/react';
import {ConnectedWalletInfo} from "@reown/appkit";


interface TokenBalance {
    symbol: string;
    balance: string;
    address?: string;
}

interface EventWithMetadata {
    timestamp: number;
    reportedErrors: Record<string, boolean>;
    data: Event;
}

// ABI для работы с ERC20
const ERC20_ABI = [
    {
        constant: true,
        inputs: [{name: "_owner", type: "address"}],
        name: "balanceOf",
        outputs: [{name: "balance", type: "uint256"}],
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {name: "_spender", type: "address"},
            {name: "_value", type: "uint256"}
        ],
        name: "approve",
        outputs: [{name: "", type: "bool"}],
        type: "function"
    },
    {
        constant: true,
        inputs: [
            {name: "_owner", type: "address"},
            {name: "_spender", type: "address"}
        ],
        name: "allowance",
        outputs: [{name: "", type: "uint256"}],
        type: "function"
    }
];

class WalletStore {
    // Состояние подключения
    state: PublicStateControllerState = null ;


    setState(state: PublicStateControllerState) {
        this.state = state;
    }


    isConnected = false;
    status: ConnectionStatus = 'disconnected';
    address = '';
    caipAddress = '';
    error: string | null = null;


    // Состояние сети
    activeChain = '';
    caipNetwork: CaipNetwork | undefined;
    chainId: string | number | undefined;

    walletInfo: ConnectedWalletInfo | null = null;
    // Балансы
    balances: Balance[] = [];
    tokenBalances = new Map<string, string>();
    loading: boolean = false

    initialized = false;
    events: EventWithMetadata[] = [];

    initializationData: {
        projectId?: string;
        metadata?: {
            name?: string;
            description?: string;
            url?: string;
            icons?: string[];
        };
        networks?: (string|number)[];
        sdkVersion?: string;
    } = {};


    // Обработка события инициализации


    // Approved суммы
    approvals: Map<string, Map<string, string>> = new Map(); // tokenAddress -> (spenderAddress -> amount)

    constructor() {
        makeAutoObservable(this, {
            initialize: flow,
            disconnect: flow,
            switchNetwork: flow,
            fetchBalances: flow
        });
        // Реакция на изменение подключения
        reaction(
            () => this.isConnected,
            (connected) => {
                if (connected) {
                    this.fetchBalances();
                }
            }
        );
    }

    handleEvent(eventWithMeta: EventWithMetadata) {
        const {timestamp, data: event,reportedErrors} = eventWithMeta;


        console.log('Новое событие :',event.event, JSON.stringify(event.properties));
        const errorString = JSON.stringify(reportedErrors);

        if (errorString !== '{}') {
            console.error('Произошла критическая ошибка :',errorString);
            return;
        }

        // Теперь правильно обращаемся к полям события
        if (event.type === 'track') {
            switch (event.event) {
                case 'INITIALIZE':
                    runInAction(() => {
                        this.initialized = true;
                        this.initializationData = {
                            projectId: event.properties?.projectId,
                            metadata: event.properties?.metadata,
                            networks: event.properties?.networks,
                            // features: event.properties?.features,
                            sdkVersion: event?.sdkVersion
                        };
                    });
                    console.log(`[${new Date(timestamp).toISOString()}] Initialize:`, JSON.stringify(this.initializationData));
                    break;

                case 'CONNECT_SUCCESS':
                    console.log(`[${new Date(timestamp).toISOString()}] Connected:`, {
                        method: event.properties?.method,
                        name: event.properties?.name
                    });
                    break;

                case 'DISCONNECT_SUCCESS':
                    console.log(`[${new Date(timestamp).toISOString()}] Disconnected`);
                    break;

                // Можно добавить другие события
            }
        }
    }


    // Разделенные методы обновления состояния
    updateConnectionState({isConnected, status}: {
        isConnected: boolean;
        status: ConnectionStatus;
    }) {
        runInAction(() => {
            this.isConnected = isConnected;
            this.status = status;
        });
    }

    updateAddresses({address, caipAddress}: {
        address?: string;
        caipAddress?: string;
    }) {
        runInAction(() => {
            this.address = address || '';
            this.caipAddress = caipAddress || '';
        });
    }

    updateEvents(events: Event[]) {
        runInAction(() => {
            alert(JSON.stringify(events));

            // this.events = events.slice(-10); // Храним только последние 10 событий
        });
    }

    reset() {
        runInAction(() => {
            this.isConnected = false;
            this.status = 'disconnected';
            this.address = '';
            this.caipAddress = '';
            this.error = null;
            this.events = [];
        });
    }

    setError(error: string) {
        this.error = error;
    }


    * initialize() {
        try {
            const {address, isConnected, status, caipAddress} = useAppKitAccount();
            const state = useAppKitState();
            const {walletInfo} = useWalletInfo();

            runInAction(() => {
                this.isConnected = isConnected;
                this.address = address || '';
                this.caipAddress = caipAddress;
                this.status = status || 'disconnected';
                this.activeChain = state.activeChain || '';
                this.walletInfo = walletInfo;
            });

            if (isConnected) {
                yield this.fetchBalances();
            }

        } catch (error) {
            console.error('Failed to initialize wallet store:', error);
            runInAction(() => {
                this.error = 'Failed to initialize wallet';
            });
        }
    }

    * disconnect() {
        try {
            // const {disconnect} = useDisconnect();
            // yield disconnect();

            runInAction(() => {
                this.isConnected = false;
                this.status = 'disconnected';
                this.address = '';
                this.caipAddress = undefined;
                this.walletInfo = null;
                this.balances = [];
                this.tokenBalances.clear();
                this.error = null;
            });

            this.addEvent({
                type: 'track',
                event: 'DISCONNECT_SUCCESS'
            });

        } catch (error) {
            console.error('Failed to disconnect:', error);
            this.addEvent({
                type: 'track',
                event: 'DISCONNECT_ERROR',
                properties: {
                    message: error?.message || 'Unknown error'
                }
            });
        }
    }


    smartAccountEnabledNetworks: number[] = [];
    userData: any = null;  // тип можно уточнить позже
    vendorEvents: Array<{
        time: number;
        context: string;
        eventType: string;
        payload?: any;
    }> = [];

    handleVendorEvent(eventData: any) {
        const { time, level, context, event, msg } = eventData;

        if (context === 'in' && event) {
            runInAction(() => {
                // Сохраняем событие в историю
                this.vendorEvents.push({
                    time,
                    context,
                    eventType: event.type,
                    payload: event.payload
                });

                // Обрабатываем конкретные типы событий
                switch (event.type) {
                    case '@w3m-app/GET_USER':
                        console.log(`[${new Date(time).toISOString()}] Getting user data`);
                        // Можно добавить дополнительную логику
                        break;

                    case '@w3m-app/GET_SMART_ACCOUNT_ENABLED_NETWORKS':
                        console.log(`[${new Date(time).toISOString()}] Getting smart account networks`);
                        // Можно сохранить сети когда придут в payload
                        if (event.payload?.networks) {
                            this.smartAccountEnabledNetworks = event.payload.networks;
                        }
                        break;

                    default:
                        console.log(`[${new Date(time).toISOString()}] Vendor event:`, event.type);
                }
            });
        }
    }

    // Геттеры для удобного доступа к данным
    get isSmartAccountEnabled() {
        return this.smartAccountEnabledNetworks.length > 0;
    }

    get lastVendorEvent() {
        return this.vendorEvents[this.vendorEvents.length - 1];
    }




    //     // Обработка событий
    // addEvent(event: Event) {
    //     this.events.push(event);
    //     // Храним только последние 10 событий
    //     if (this.events.length > 10) {
    //         this.events.shift();
    //     }
    // }


    * switchNetwork(network: CaipNetwork) {
        try {
            const {switchNetwork} = useAppKitNetwork();

            alert(JSON.stringify(network));
            console.log('switch network', network);
            // yield switchNetwork(network);
            //
            // runInAction(() => {
            //     this.caipNetwork = network;
            //     this.chainId = network.id;
            // });
            //
            // this.addEvent({
            //     type: 'track',
            //     event: 'SWITCH_NETWORK',
            //     properties: {
            //         network: network.name
            //     }
            // });
            //
            // // Обновляем балансы после переключения сети
            // yield this.fetchBalances();

        } catch (error) {
            console.error('Failed to switch network:', error);
            runInAction(() => {
                this.error = 'Failed to switch network';
            });
        }
    }

    * fetchBalances() {
        if (!this.address) return;

        try {
            this.loading = true;

            console.log('fetch balances', this.address);
            alert(JSON.stringify(JSON.stringify(this.address)));

            // // Используем BlockchainApiController для получения балансов
            // const response = yield window.ethereum.request({
            //     method: 'eth_getBalance',
            //     params: [this.address, 'latest']
            // });
            //
            // runInAction(() => {
            //     this.balances = response.balances;
            //
            //     // Обновляем Map с балансами токенов
            //     response.balances.forEach(balance => {
            //         this.tokenBalances.set(balance.token.symbol, balance.amount);
            //     });
            // });

        } catch (error) {
            console.error('Failed to fetch balances:', error);
            runInAction(() => {
                this.error = 'Failed to fetch balances';
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }


}

export const walletStore = new WalletStore();


//

//
//     // Геттеры
//     get isReady() {
//         return !this.loading && this.isConnected;
//     }
//
//     get currentNetworkName() {
//         return this.caipNetwork?.name || 'Unknown Network';
//     }
//
//     get formattedAddress() {
//         if (!this.address) return '';
//         return `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
//     }
//
//     get nativeBalance() {
//         return this.tokenBalances.get('ETH') || '0';
//     }
//
//     get formattedNativeBalance() {
//         return (Number(this.nativeBalance) / 1e18).toFixed(4);
//     }
//
//
//     *approveToken(tokenAddress: string, spenderAddress: string, amount: string) {
//         if (!this.isConnected || !this.address) return;
//
//         try {
//             this.loading = true;
//             this.error = null;
//
//             const { writeContract } = useWriteContract();
//
//             const tx = yield writeContract({
//                 address: tokenAddress,
//                 abi: ERC20_ABI,
//                 functionName: 'approve',
//                 args: [spenderAddress, BigInt(amount)]
//             });
//
//             // Обновляем allowance после успешного approve
//             yield this.checkAllowance(tokenAddress, spenderAddress);
//
//             return tx;
//
//         } catch (error) {
//             console.error('Failed to approve token:', error);
//             runInAction(() => {
//                 this.error = 'Failed to approve token';
//             });
//         } finally {
//             runInAction(() => {
//                 this.loading = false;
//             });
//         }
//     }
//
//     *checkAllowance(tokenAddress: string, spenderAddress: string) {
//         if (!this.address) return;
//
//         try {
//             const { data: allowance } = yield useReadContract({
//                 address: tokenAddress,
//                 abi: ERC20_ABI,
//                 functionName: 'allowance',
//                 args: [this.address, spenderAddress]
//             });
//
//             if (allowance) {
//                 if (!this.approvals.has(tokenAddress)) {
//                     this.approvals.set(tokenAddress, new Map());
//                 }
//                 this.approvals.get(tokenAddress)?.set(spenderAddress, allowance.toString());
//             }
//
//             return allowance;
//
//         } catch (error) {
//             console.error('Failed to check allowance:', error);
//         }
//     }
//
//     get usdtBalance() {
//         return Array.from(this.tokenBalances.values())
//             .find(token => token.symbol === 'USDT')?.balance || '0';
//     }
//
//     startEventListening() {
//         const events = useAppKitEvents();
//         runInAction(() => {
//             // Обрабатываем события подключения/отключения
//             if (events.length > 0) {
//                 const lastEvent = events[events.length - 1];
//                 switch (lastEvent.type) {
//                     case 'track':
//                         switch (lastEvent.event) {
//                             case 'CONNECT_SUCCESS':
//                                 this.handleConnectSuccess(lastEvent);
//                                 break;
//                             case 'DISCONNECT_SUCCESS':
//                                 this.handleDisconnectSuccess();
//                                 break;
//                             case 'SWITCH_NETWORK':
//                                 this.handleNetworkSwitch(lastEvent);
//                                 break;
//                             // Добавляем другие события по необходимости
//                         }
//                         break;
//                 }
//             }
//         });
//     }
//
//     stopEventListening() {
//         // Очистка подписок если необходимо
//     }
//
//     private handleConnectSuccess(event: any) {
//         runInAction(() => {
//             this.isConnected = true;
//             this.status = 'connected';
//             if (event.properties?.method) {
//                 // Можно добавить дополнительную информацию о методе подключения
//                 this.connectionMethod = event.properties.method;
//             }
//             // Обновляем балансы при успешном подключении
//             this.fetchBalances();
//         });
//     }
//
//     private handleDisconnectSuccess() {
//         runInAction(() => {
//             this.isConnected = false;
//             this.status = 'disconnected';
//             this.address = '';
//             this.caipAddress = '';
//             this.walletInfo = null;
//             this.tokenBalances.clear();
//             this.approvals.clear();
//         });
//     }
//
//     private handleNetworkSwitch(event: any) {
//         runInAction(() => {
//             if (event.properties?.network) {
//                 this.selectedNetworkId = event.properties.network;
//                 // Обновляем балансы при переключении сети
//                 this.fetchBalances();
//             }
//         });
//     }
//
//     // Добавляем геттер для статуса загрузки балансов
//     get isLoadingBalances() {
//         return this.loading;
//     }
//
//     // Добавляем геттер для форматированных балансов
//     get formattedBalances() {
//         return {
//             native: {
//                 value: Number(this.nativeBalance) / 1e18,
//                 symbol: this.currentNetwork?.nativeCurrency?.symbol || 'ETH'
//             },
//             usdt: {
//                 value: Number(this.usdtBalance) / 1e6,
//                 symbol: 'USDT'
//             }
//         };
//     }
//
//
// }

