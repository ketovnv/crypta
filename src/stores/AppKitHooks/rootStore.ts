// rootStore.ts
import { makeAutoObservable } from 'mobx';
import {RootStore} from './types.ts'
import  {
    createAcountStore,
    createStateStore,
} from './hookStores';

export const createRootStore = (): RootStore => {
    // Создаем подсторы
    const accountStore = createAcountStore();
    const stateStore = createStateStore();

    //
    // const balanceStore = createBalanceStore();
    // const transactionStore = createTransactionStore();
    // const networkStore = createNetworkStore();

    return  makeAutoObservable({
        // Доступ к дочерним сторам
        account: accountStore,
        state: stateStore,
        // balance: balanceStore,
        // transaction: transactionStore,
        // network: networkStore,

        // Расчетные свойства, использующие несколько сторов
        get isReady() {
            return accountStore.isConnected
                // && !networkStore.loading;
        },


        // Глобальная очистка всех сторов
        cleanup() {
            accountStore.cleanup();
            stateStore.cleanup();
            // balanceStore.cleanup();
            // transactionStore.cleanup();
            // networkStore.cleanup();
        }
    });
};

// Создание синглтон-экземпляра rootStore
export const rootStore = createRootStore();