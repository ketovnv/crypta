// components/observers/AppKitObserver.tsx
import { observer } from "mobx-react-lite";
import {
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useWalletInfo,
} from "@reown/appkit/react";
import { useEffect } from "react";
import { loggerStore } from "../../stores/logger";
import { eventsStore } from "../../stores/events";
import { walletStore } from "../../stores/wallet.ts";

export const AppKitObserver = observer(() => {
  const account = useAppKitAccount();
  const event = useAppKitEvents();
  const state = useAppKitState();
  const network  = useAppKitNetwork();
  const {walletInfo} = useWalletInfo();
  // loggerStore.warning("🥷", "AppKitObserver render");
  // Отслеживаем изменения аккаунта
  useEffect(() => {
    if (account.isConnected) {
      // console.log("Account: ", account);
    } else {
      // loggerStore.logJSON("account", account);
    }
    walletStore.setAccountData(account);
  }, [account.isConnected]);

  useEffect(() => {
    if(event.reportedErrors){
       console.warn(JSON.stringify(event.reportedErrors))
       loggerStore.logJSON("reportedErrors", event.reportedErrors);
    }
    // loggerStore.logJSON("Новое событие", event.data);
    eventsStore.addEvent(event);
  }, [event]);


  // Отслеживаем изменения сети
  useEffect(() => {
    // loggerStore.logJSON("state", state);
    eventsStore.setCurrentState(state);
  }, [state]);

  useEffect(() => {
    walletStore.setWalletInformation(walletInfo);
  }, [walletInfo]);

  useEffect(() => {
    walletStore.setNetwork(network);
  }, [network]);


  return null;
});
