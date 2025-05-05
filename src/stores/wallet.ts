// src/stores/WalletStore.ts
import {action, makeAutoObservable} from "mobx";
import type {AppKitNetwork, CaipAddress, CaipNetwork, CaipNetworkId,} from "@reown/appkit-common";
// import { ethers } from 'ethers';
import type {AccountControllerState, AccountType, Event,} from "@reown/appkit/react";
import type {W3mFrameTypes} from "@reown/appkit-wallet";
import {logger} from "./logger.js";
import type {UseAppKitAccountReturn} from "@reown/appkit";


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

interface ConnectedWalletInfo {
    name: string;
    icon?: string;
    type?: string;

    [key: string]: unknown;
}

interface Network {
    caipNetwork: CaipNetwork | undefined;
    chainId: number | string | undefined;
    caipNetworkId: CaipNetworkId | undefined;
    switchNetwork: (network: AppKitNetwork) => void;
}


interface AccountData {
    allAccounts: AccountType[];
    caipAddress: CaipAddress | undefined;
    address: string | undefined;
    isConnected: boolean;
    embeddedWalletInfo?: {
        user: AccountControllerState["user"];
        authProvider: AccountControllerState["socialProvider"] | "email";
        accountType: W3mFrameTypes.AccountType | undefined;
        isSmartAccountDeployed: boolean;
    };
    status: AccountControllerState["status"];
}

const USDT_ADDRESSES = {
    // Основная сеть Ethereum
    '1': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    // Тестовая сеть Sepolia (пример адреса, нужно заменить на реальный)
    '11155111': '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06'
} as const;





class WalletStore {

    activeAddress: `0x${string}` | null = '0x364bD6dd75e61E4a2ABdDfE474084007A7f86730';
    chains = [17000]
    error: string | null = null;
    addressBalances: {} = {};
    // tokenBalances: Map<string, string> = new Map();
    addressForBalance: `0x${string}` | null = null;
    connectedWallet: ConnectedWalletInfo | null = null;
    accountData: UseAppKitAccountReturn | null = null;
    wagmiAccountData: UseAppKitAccountReturn | null = null;
    network: Network | null = null;

    constructor() {
        makeAutoObservable(this, {
            setWalletInformation: action,
            setAccountData: action,
            setNetwork: action,
            setWagmiAccountData: action,
            setChains: action,
            setAddressForBalance: action,

        });
    }


    get isConnected() {
        return this.accountData?.isConnected
    }



    setNetwork(
        network: Network) {
        this.network = network;
    }

    setChains(
        chains: number[]) {
        this.chains = chains;
    }

    setAddressForBalance(addressForBalance: `0x${string}`) {
        this.addressForBalance = addressForBalance;
    }

    setActiveAddress(address: `0x${string}`) {
        this.activeAddress = address;
    }


    addAddressBalance({chainId, balance}) {
        this.addressBalances[chainId] = balance;
    }


    getBalance = (chainId: `0x${string}`) => this.addressBalances[chainId]


    /**
     * Получить все сохранённые балансы
     */
    get getAllBalances() {
        return this.addressBalances;
    }


    /**
     * Получить список всех chainId, по которым есть данные
     */
    get getBalancedChains() {
        return Object.keys(this.addressBalances);
    }


    setAccountData(
        account: UseAppKitAccountReturn) {
        this.accountData = account;
        if (this.accountData?.address) { // @ts-ignore
            this.setAddressForBalance(this.accountData?.address)
        }
        // logger.logJSON('account', JSON.stringify(account))
    }

    setWagmiAccountData(
        wagmiAccountData: UseAppKitAccountReturn) {
        this.wagmiAccountData = wagmiAccountData;
        console.log('wagmiAccountData', wagmiAccountData)
    }


    get getAccountData() {
        return this.accountData && this.accountData?.isConnected ?
            this.accountData : null
    }

    setWalletInformation(
        wallet: ConnectedWalletInfo) {
        this.connectedWallet = wallet;
    }

    get getWagmiAccountData() {
        return this.wagmiAccountData
    }


    get getNetwork() {
        return this.network
    }

    get getWalletInformation() {
        return this.connectedWallet
    }

    get getChains() {
        return this.chains
    }

    get getAddressForBalance() {
        return this.addressForBalance
    }

}

export const walletStore = new WalletStore();
