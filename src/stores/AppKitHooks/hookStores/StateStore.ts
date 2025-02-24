import { createAppKitStore } from "../createAppKitStore.ts";
import { makeAutoObservable } from "mobx";
import { accountStore, stateStore } from "../types.ts";

export default (): stateStore => {
  const appKitStore = createAppKitStore();

  return makeAutoObservable({
    ...appKitStore,

    networkId: null,
    loading: false,
    error: null,

    setAccountData(data: Partial<stateStore>) {
      // Обновляем только изменившиеся поля
      Object.entries(data).forEach(([key, value]) => {
        if (this[key as keyof stateStore] !== value) {
          this[key as keyof stateStore] = value;
        }
      })
    }
  })
}
