// stores/types.ts
import type {AccountType} from "@reown/appkit/react";


export interface RootStore{
    account: accountStore;
    state: stateStore,
    // token: tokenStore;
    // balance: balanceStore;
    // transaction: TransactionStore;
    // network: NetworkStore;
    isReady: boolean;
    cleanup: () => void;
}

export interface appKitStore {
    subscriptions: (() => void)[];
    addSubscription: (unsubscribe: () => void) => void;
    cleanup: () => void;
}

export interface stateStore {
    networkId: string | null;
    loading : boolean;
    error: Error | null;
}


export interface tokenStore extends appKitStore {
    tokens: Record<string, string>;
    addToken: (address: string, symbol: string) => void;
}

export  interface accountStore extends appKitStore {
    address:string | null,
    isConnected : boolean,
    chainId: number | null,
    accounts: AccountType[]
}