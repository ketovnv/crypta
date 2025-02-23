// src/pages/f.tsx

import "@reown/appkit-wallet-button/react";
import { observer } from "mobx-react-lite";
import {
  Text,
  Group,
  Container,
  List,
  ThemeIcon,
  Code,
  Title,
  Button,
  Stack,
  Center,
} from "@mantine/core";
import { IoArrowForwardSharp } from "react-icons/io5";
import { useEffect } from "react";
import classes from "./Home.module.css";



import {
  useDisconnect,
  useAppKit,
  useAppKitNetwork,
} from "@reown/appkit/react";

import { LogViewer } from "@/components/logger/LogViewer";

import { walletStore } from "@/stores/wallet";




import { loggerStore } from "@/stores/logger";
import {


  useAppKitState,
  useAppKitEvents,
  useAppKitAccount,
  useWalletInfo,
} from "@reown/appkit/react";

const Home = observer(() => {
  loggerStore.success("Приложение запущено");
  AppKitStateWrapper();
  // useAppKitAccount();



  // console.log("useAppKitStaten", setState);

  // walletStore.setState = useAppKitState();

  // const { address, caipAddress, isConnected, status } =


  // loggerStore.logJSON("address"),
  // console.log(
  //   "caipAddress",
  //   JSON.stringify(caipAddress),
  //   "isConnected",
  //   JSON.stringify(isConnected),
  // );
  // const event = useAppKitEvents();
  // const { walletInfo } = useWalletInfo();
  // const { disconnect } = useDisconnect();

  // useEffect(() => {
    // if (isConnected) {
    // loggerStore.success("Connected!!!");
    // }
    // console.log('Layout mounted');
    // return () => console.log('Layout unmounted');
  // }, [isConnected]);

  useEffect(() => {
    // loggerStore.group("Событие");
    // console.log("Event:", event?.data, event);
    // loggerStore.logJSON("Данные события", event.data);
    // loggerStore.groupEnd();
  }, [event]);

  return (
    //<ScrollArea h="calc(100vh - var(--app-shell-header-height, 0px) - 75px)" >
    <Container size="xl" w="75vw">

      {/*<List*/}
      {/*  spacing="xs"*/}
      {/*  size="sm"*/}
      {/*  className={classes.card}*/}
      {/*  center*/}
      {/*  icon={*/}
      {/*    <ThemeIcon*/}
      {/*      color={isConnected ? "teal" : "gray"}*/}
      {/*      className={classes.arrowIcon}*/}
      {/*      size={15}*/}
      {/*      radius="md"*/}
      {/*      variant="outline"*/}
      {/*    >*/}
      {/*      {isConnected && <IoArrowForwardSharp />}*/}
      {/*    </ThemeIcon>*/}
      {/*  }*/}
      {/*>*/}
      {/*  <List.Item>*/}
      {/*    <Group>*/}
      {/*      <Code>Выбранная сеть</Code>*/}
      {/*      <appkit-network-button />*/}
      {/*    </Group>*/}
      {/*  </List.Item>*/}
      {/*  <LogViewer />*/}
      {/*  {isConnected && (*/}
      {/*    <Group justify="space-between" align="center">*/}
      {/*      <Stack>*/}
      {/*        <List.Item>*/}
      {/*          <Code>Адрес:</Code>{" "}*/}
      {/*          <Text className={classes.listText} component="span">*/}
      {/*            {address}*/}
      {/*          </Text>*/}
      {/*        </List.Item>*/}
      {/*        <List.Item style={{ position: "relative", top: "-15px" }}>*/}
      {/*          <Code>Адрес caip</Code>{" "}*/}
      {/*          <Text className={classes.listText} component="span">*/}
      {/*            {caipAddress}*/}
      {/*          </Text>*/}
      {/*        </List.Item>*/}
      {/*      </Stack>*/}
      {/*      <Button onClick={() => disconnect()} variant="outline" color="red">*/}
      {/*        Отключить*/}
      {/*      </Button>*/}
      {/*    </Group>*/}
      {/*  )}*/}
      {/*</List>*/}

      {/*{isConnected ? (*/}
      {/*  <Group align="center">*/}
      {/*    <appkit-account-button />*/}

      {/*    <Title>*/}
      {/*      /&nbsp;*/}
      {/*      <Text className={classes.walletName} component="span" inherit>*/}
      {/*        {walletInfo?.name}*/}
      {/*      </Text>*/}
      {/*    </Title>*/}
      {/*    <Code color="teal" className={classes.status}>*/}
      {/*      Подключён*/}
      {/*    </Code>*/}
      {/*  </Group>*/}
      {/*) : (*/}
      {/*  <Center>*/}
      {/*    <appkit-connect-button />*/}
      {/*  </Center>*/}
      {/*)}*/}

      {/*<appkit-wallet-button />*/}
    </Container>
  );
});

export default Home;
