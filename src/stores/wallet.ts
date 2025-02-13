// src/stores/WalletStore.ts
import { makeAutoObservable, flow, reaction, runInAction } from 'mobx';
import { useAppKit, useAppKitNetwork, useAppKitState, useAppKitTheme, useDisconnect } from '@reown/appkit/react';
import { networks } from '../config';

interface WalletInfo {
    name: string;
    icon?: string;
    // Добавьте другие поля по необходимости
}

class WalletStore {
    // Базовое состояние кошелька
    isConnected = false;
    address = '';
    caipAddress = '';
    status = '';

    // Состояние темы
    themeMode = 'dark';

    // Состояние сети
    activeChain = '';
    selectedNetworkId: string | null = null;

    // Информация о кошельке
    walletInfo: WalletInfo | null = null;

    // Состояние загрузки
    loading = false;
    isModalOpen = false;

    // События кошелька
    events: any[] = [];

    constructor() {
        makeAutoObservable(this, {
            initialize: flow,
            switchNetwork: flow,
            disconnect: flow
        });
    }

    // Инициализация состояния
    *initialize() {
        try {
            // Подписываемся на изменение состояния AppKit
            const { open } = useAppKit();
            const { switchNetwork } = useAppKitNetwork();
            const state = useAppKitState();
            const theme = useAppKitTheme();

            runInAction(() => {
                this.isModalOpen = state.open;
                this.loading = state.loading;
                this.activeChain = state.activeChain;
                this.selectedNetworkId = state.selectedNetworkId;
                this.themeMode = theme.themeMode;
            });

            // Настраиваем реакции на изменения
            reaction(
                () => this.isConnected,
                (connected) => {
                    if (connected) {
                        this.fetchWalletInfo();
                    }
                }
            );

        } catch (error) {
            console.error('Failed to initialize wallet store:', error);
        }
    }

    // Методы управления кошельком
    openModal = () => {
        const { open } = useAppKit();
        open();
        runInAction(() => {
            this.isModalOpen = true;
        });
    };

    closeModal = () => {
        runInAction(() => {
            this.isModalOpen = false;
        });
    };

    *switchNetwork(networkIndex: number) {
        try {
            const { switchNetwork } = useAppKitNetwork();
            yield switchNetwork(networks[networkIndex]);

            // Обновляем состояние после переключения
            this.fetchWalletInfo();
        } catch (error) {
            console.error('Failed to switch network:', error);
        }
    }

    *disconnect() {
        try {
            const { disconnect } = useDisconnect();
            yield disconnect();

            runInAction(() => {
                this.isConnected = false;
                this.address = '';
                this.caipAddress = '';
                this.walletInfo = null;
            });
        } catch (error) {
            console.error('Failed to disconnect:', error);
        }
    }

    // Получение информации о кошельке
    private *fetchWalletInfo() {
        try {
            const { walletInfo } = useWalletInfo();

            runInAction(() => {
                this.walletInfo = walletInfo;
            });
        } catch (error) {
            console.error('Failed to fetch wallet info:', error);
        }
    }

    // Обработчик событий
    addEvent = (event: any) => {
        runInAction(() => {
            this.events.push(event);
            // Хранить только последние 10 событий
            if (this.events.length > 10) {
                this.events.shift();
            }
        });
    };

    // Геттеры для вычисляемых значений
    get isReady() {
        return !this.loading && this.isConnected;
    }

    get currentNetwork() {
        return networks.find(n => n.id === this.selectedNetworkId);
    }
}

export const walletStore = new WalletStore();