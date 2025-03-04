// components/observers/AppKitObserver.tsx
import { observer } from "mobx-react-lite";
import {
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
} from "@reown/appkit/react";
import { useEffect } from "react";
import { loggerStore } from "../../stores/logger";
import { accountStore } from "../../stores/account";
import { eventsStore } from "../../stores/events";

export const AppKitObserver = observer(() => {
  const account = useAppKitAccount();
  const event = useAppKitEvents();
  const state = useAppKitState();

  // Отслеживаем изменения аккаунта
  useEffect(() => {
    if (account.isConnected) {
      // console.clear();
      console.log("Account: ", account);
      // loggerStore.logArray("allAccounts", account.allAccounts);
      // loggerStore.logJSON("embeddedWalletInfo", account.embeddedWalletInfo);
      // loggerStore.info("caipAddress " + account.caipAddress);
      // loggerStore.info("address " + account.address);
      // loggerStore.success("isConnected" + account.isConnected);
      // loggerStore.success("status" + account.status);
    } else {
      // loggerStore.logJSON("account", account);
    }

    accountStore.setAccountData(account);
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
    eventsStore.addState(state);
  }, [state]);




  return null;
});
