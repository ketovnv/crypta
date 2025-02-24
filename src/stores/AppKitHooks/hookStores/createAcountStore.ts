import { createAppKitStore } from "../createAppKitStore.ts";
import { makeAutoObservable } from "mobx";
import { accountStore } from "../types.ts";

export default (): accountStore => {
  const appKitStore = createAppKitStore();

 return makeAutoObservable({
    ...appKitStore,

    address: null,
    isConnected: false,
    chainId: null,
    accounts:[],

    setAccountData(data: Partial<accountStore>) {
      // Обновляем только изменившиеся поля
      Object.entries(data).forEach(([key, value]) => {
        if (this[key as keyof accountStore] !== value) {
          this[key as keyof accountStore] = value;
        }
      })
    },

    // Вычисляемые значения с помощью computed
    get formattedAddress() {
      return this.address
        ? `${this.address.slice(0, 6)}...${this.address.slice(-4)}`
        : null;
    },

    get currentNetwork() {
      return this.chainId ? `Chain ID: ${this.chainId}` : "Not connected";
    }
  })
}
