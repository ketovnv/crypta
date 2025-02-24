import { makeAutoObservable } from 'mobx';
import { appKitStore } from './types'

export const createAppKitStore = (): appKitStore =>{
  return makeAutoObservable({
    subscriptions: [],

    addSubscription(unsubscribe: () => void) {
      this.subscriptions.push(unsubscribe);
      return this.subscriptions.length - 1; // Возвращаем индекс подписки
    },

    cleanup() {
      this.subscriptions.forEach(unsubscribe => unsubscribe());
      this.subscriptions = [];
    }
  });
};
