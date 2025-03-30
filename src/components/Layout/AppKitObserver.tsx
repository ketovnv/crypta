// components/observers/AppKitObserver.tsx
import "@mantine/notifications/styles.css";
import { observer } from "mobx-react-lite";
import {
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useWalletInfo,
} from "@reown/appkit/react";
import { useEffect } from "react";
import { eventsStore } from "../../stores/events";
import { walletStore } from "../../stores/wallet.ts";
import { notifications } from "@mantine/notifications";
import { logger } from "stores/logger.js";
import { LogJSON } from "components/logger/LogJSON.jsx";

export const AppKitObserver = observer(() => {
  const account = useAppKitAccount();
  const state = useAppKitState();
  const network = useAppKitNetwork();
  const { walletInfo } = useWalletInfo();
  const event = useAppKitEvents();

  useEffect(() => {
    if (account.isConnected) {
      // console.log("Account: ", account);
    } else {
      // logger.logJSON("account", account);
    }
    walletStore.setAccountData(account);
  }, [account.isConnected]);

  useEffect(() => {
    // const element = document.getElementById("external-container");
    // setExternalElement(element);
  }, []);

  useEffect(() => {
    // f (event.reportedErrors) {
    //   // console.warn(JSON.stringify(event.reportedErrors));
    //   logger.logJSON("reportedErrors", event.reportedErrors);
    // }    // logger.logJSON("Новое событие", event.data);
    eventsStore.addEvent(event);
    const title =
      "INITIALIZE" === event?.data?.event
        ? "Добро пожаловать!"
        : event?.data?.event;
    console.log("🚀 ~  ~ event?.data?.event: ", event?.data?.event);

    const message =
      "INITIALIZE" === event?.data?.event
        ? "Добро пожаловать!"
        : JSON.stringify(event?.data?.properties);

    if (event.reportedErrors) {
      logger.logJSON("☠️reportedErrors☠️", event.reportedErrors);
    }

    setTimeout(
      () =>
        notifications.show({
          title,
          message: <LogJSON label={""} json={message} fontSize={10} />,
        }),
      2000,
    );
    logger.logJSON("Новое событие", event);
  }, [event]);

  useEffect(() => {
    // logger.logJSON("state", state);
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
