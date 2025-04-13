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
import { animation } from "../../stores/animation";
import { walletStore } from "../../stores/wallet.ts";
import { Notifications, notifications } from "@mantine/notifications";
import { logger } from "stores/logger.js";
// @ts-ignore
import classes from "./AppKitObserver.module.css";

export const AppKitObserver = observer(() => {
  logger.debug("🎃init🎃", "AppKitObserver📺📺", 10);

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
    logger.logJSON("Новое событие", event);
    const { title, message } = eventsStore.addEvent(event);

    if (event.reportedErrors) {
      logger.logJSON("☠️reportedErrors☠️", event.reportedErrors);
    }
    if (!title && !message) return;
    setTimeout(
      () =>
        notifications.show({
          classNames: classes,
          title,
          message: JSON.stringify(message),
          style: {
            background: animation.getThemeColors.background,
            color: animation.getThemeColors.color,
          },
        }),
      1000,
    );
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

  return <Notifications position="top-right" />;
});
