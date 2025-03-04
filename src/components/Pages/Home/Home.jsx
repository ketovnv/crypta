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
  SimpleGrid,
} from "@mantine/core";
import { IoArrowForwardSharp } from "react-icons/io5";
import { useEffect } from "react";
import classes from "./Home.module.css";

// import {LogViewer} from "@/components/logger/LogViewer";

// import {walletStore} from "@/stores/wallet";

// import { loggerStore } from "@/stores/logger";
// import { accountStore } from "@/stores/account";
// import { eventsStore } from "@/stores/events.js";
// import {LogJSON} from "@components/logger/LogJSON.jsx";
// import {
//   useAppKitEvents,
//   useWalletInfo,
//   useDisconnect,
//   useAppKitState,
// } from "@reown/appkit/react";
import { LogJSON } from "@components/logger/LogJSON.jsx";
// import BalanceTracker from "@components/Pages/Home/components/BallanceTracker.js";

const Home = observer(() => {
  // loggerStore.warning("🏩 Компонент Home");
  // const { disconnect } = useDisconnect();

  // const {walletInfo} = useWalletInfo();



  // useEffect(() => {
  //     if (walletInfo) loggerStore.logJSON(walletInfo);
  // }, [walletInfo]);

  return (
    <Container size="xl" w="75vw">
      <appkit-button />

      <SimpleGrid
        spacing="xl"
        verticalSpacing="lg"
        cols={2}
        justify="space-between"
      >
        <Stack>
          {/*<LogJSON label="state" json={eventsStore.getState()} />*/}
            {/*<LogJSON label="state" json={networkStore.getState} />*/}
        </Stack>
        <Stack>
          <Title>Аккаунт</Title>
          {/*{accountStore.getAccount ? (*/}
          {/*  <Stack>*/}
          {/*    /!*<LogJSON label="account" json={accountStore.getAccount()} />*!/*/}
          {/*    <Button onClick={() => disconnect()} variant="outline" color="red">*/}
          {/*      Отключить*/}
          {/*    </Button>*/}
          {/*  </Stack>*/}
          {/*) : (*/}
          {/*  <Text>Процесс инициализации...</Text>*/}
          {/*)}*/}
        </Stack>
        <Stack>
          {/*<Title>Баланс</Title>*/}
          {/*<BalanceTracker />*/}
        </Stack>
      </SimpleGrid>
    </Container>
  );
});

export default Home;

{
  /*<AnimatedFontDisplay text=" Компонент Home" />*/
}

{
  /*<Grid>*/
}
{
  /*    /!* Основная информация *!/*/
}
{
  /*    <Grid.Col span={8}>*/
}
{
  /*        <Paper p="md" radius="md" shadow="sm">*/
}
{
  /*            <InfoList />*/
}
{
  /*        </Paper>*/
}
{
  /*    </Grid.Col>*/
}
{
  /*    <List*/
}
{
  /*      spacing="xs"*/
}
{
  /*      size="sm"*/
}
{
  /*      className={classes.card}*/
}
{
  /*      center*/
}
{
  /*      icon={*/
}
{
  /*        <ThemeIcon*/
}
{
  /*          color={isConnected ? "teal" : "gray"}*/
}
{
  /*          className={classes.arrowIcon}*/
}
{
  /*          size={15}*/
}
{
  /*          radius="md"*/
}
{
  /*          variant="outline"*/
}
{
  /*        >*/
}
{
  /*          {isConnected && <IoArrowForwardSharp />}*/
}
{
  /*        </ThemeIcon>*/
}
{
  /*      }*/
}
{
  /*    >*/
}
{
  /*      <List.Item>*/
}
{
  /*        <Group>*/
}
{
  /*          <Code>Выбранная сеть</Code>*/
}
{
  /*          <appkit-network-button />*/
}
{
  /*        </Group>*/
}
{
  /*      </List.Item>*/
}
{
  /*      <LogViewer />*/
}
{
  /*      {isConnected && (*/
}
{
  /*        <Group justify="space-between" align="center">*/
}
{
  /*          <Stack>*/
}
{
  /*            <List.Item>*/
}
{
  /*              <Code>Адрес:</Code>{" "}*/
}
{
  /*              <Text className={classes.listText} component="span">*/
}
{
  /*                {address}*/
}
{
  /*              </Text>*/
}
{
  /*            </List.Item>*/
}
{
  /*            <List.Item style={{ position: "relative", top: "-15px" }}>*/
}
{
  /*              <Code>Адрес caip</Code>{" "}*/
}
{
  /*              <Text className={classes.listText} component="span">*/
}
{
  /*                {caipAddress}*/
}
{
  /*              </Text>*/
}
{
  /*            </List.Item>*/
}
{
  /*          </Stack>*/
}
{
  /*          <Button onClick={() => disconnect()} variant="outline" color="red">*/
}
{
  /*            Отключить*/
}
{
  /*          </Button>*/
}
{
  /*        </Group>*/
}
{
  /*      )}*/
}
{
  /*    </List>*/
}
{
  /*    /!* Быстрые действия *!/*/
}
{
  /*    <Grid.Col span={4}>*/
}
{
  /*        <Paper p="md" radius="md" shadow="sm">*/
}
{
  /*            <Title order={3} mb="md">Действия</Title>*/
}
{
  /*            <ActionButtonList />*/
}
{
  /*        </Paper>*/
}
{
  /*    </Grid.Col>*/
}
{
  /*    /!*{isConnected ? (*!/*/
}
{
  /*    /!*  <Group align="center">*!/*/
}
{
  /*    /!*    <appkit-account-button />*!/*/
}
{
  /*    /!* Статистика кошелька *!/*/
}
{
  /*    {walletStore.isConnected && (*/
}
{
  /*        <>*/
}
{
  /*            <Grid.Col span={6}>*/
}
{
  /*                <Paper p="md" radius="md" shadow="sm">*/
}
{
  /*                    <Title order={3} mb="md">Балансы</Title>*/
}
{
  /*                    <Group spacing="xl">*/
}
{
  /*                        {Array.from(walletStore.balances.entries()).map(([key, balance]) => (*/
}
{
  /*                            <RingProgress*/
}
{
  /*                                key={key}*/
}
{
  /*                                size={120}*/
}
{
  /*                                roundCaps*/
}
{
  /*                                thickness={8}*/
}
{
  /*                                sections={[{ value: 100, color: 'blue' }]}*/
}
{
  /*                                label={*/
}
{
  /*                                    <Text size="xs" align="center">*/
}
{
  /*                                        {balance.symbol}*/
}
{
  /*                                        <br />*/
}
{
  /*                                        {parseFloat(balance.balance).toFixed(4)}*/
}
{
  /*                                    </Text>*/
}
{
  /*                                }*/
}
{
  /*                            />*/
}
{
  /*                        ))}*/
}
{
  /*                    </Group>*/
}
{
  /*                </Paper>*/
}
{
  /*            </Grid.Col>*/
}
{
  /*                <Title>*/
}
{
  /*                  /&nbsp;*/
}
{
  /*                  <Text className={classes.walletName} component="span" inherit>*/
}
{
  /*                    {walletInfo?.name}*/
}
{
  /*                  </Text>*/
}
{
  /*                </Title>*/
}
{
  /*                <Code color="teal" className={classes.status}>*/
}
{
  /*                  Подключён*/
}
{
  /*                </Code>*/
}
{
  /*              </Group>*/
}
{
  /*            ) : (*/
}
{
  /*              <Center>*/
}
{
  /*                <appkit-connect-button />*/
}
{
  /*              </Center>*/
}
{
  /*            )}*/
}
{
  /*            <Grid.Col span={6}>*/
}
{
  /*                <Paper p="md" radius="md" shadow="sm">*/
}
{
  /*                    <Title order={3} mb="md">Последние события</Title>*/
}
{
  /*                    {walletStore.events.slice(-5).map((event, index) => (*/
}
{
  /*                        <Text key={index} size="sm" mb="xs">*/
}
{
  /*                            {event}*/
}
{
  /*                        </Text>*/
}
{
  /*                    ))}*/
}
{
  /*                </Paper>*/
}
{
  /*            </Grid.Col>*/
}
{
  /*        </>*/
}
{
  /*    )}*/
}
{
  /*</Grid>*/
}

{
  /*<appkit-wallet-button />*/
}

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

// useEffect(() => {
// if (isConnected) {
// loggerStore.success("Connected!!!");
// }
// console.log('Layout mounted');
// return () => console.log('Layout unmounted');
// }, [isConnected]);
{
  /*<BalanceTracker/>*/
}
{
  /*<List*/
}
{
  /*  spacing="xs"*/
}
{
  /*  size="sm"*/
}
{
  /*  className={classes.card}*/
}
{
  /*  center*/
}
{
  /*  icon={*/
}
{
  /*    <ThemeIcon*/
}
{
  /*      color={isConnected ? "teal" : "gray"}*/
}
{
  /*      className={classes.arrowIcon}*/
}
{
  /*      size={15}*/
}
{
  /*      radius="md"*/
}
{
  /*      variant="outline"*/
}
{
  /*    >*/
}
{
  /*      {isConnected && <IoArrowForwardSharp />}*/
}
{
  /*    </ThemeIcon>*/
}
{
  /*  }*/
}
{
  /*>*/
}
{
  /*  <List.Item>*/
}
{
  /*    <Group>*/
}
{
  /*      <Code>Выбранная сеть</Code>*/
}
{
  /*      <appkit-network-button />*/
}
{
  /*    </Group>*/
}
{
  /*  </List.Item>*/
}
{
  /*  <LogViewer />*/
}
{
  /*  {isConnected && (*/
}
{
  /*    <Group justify="space-between" align="center">*/
}
{
  /*      <Stack>*/
}
{
  /*        <List.Item>*/
}
{
  /*          <Code>Адрес:</Code>{" "}*/
}
{
  /*          <Text className={classes.listText} component="span">*/
}
{
  /*            {address}*/
}
{
  /*          </Text>*/
}
{
  /*        </List.Item>*/
}
{
  /*        <List.Item style={{ position: "relative", top: "-15px" }}>*/
}
{
  /*          <Code>Адрес caip</Code>{" "}*/
}
{
  /*          <Text className={classes.listText} component="span">*/
}
{
  /*            {caipAddress}*/
}
{
  /*          </Text>*/
}
{
  /*        </List.Item>*/
}
{
  /*      </Stack>*/
}
{
  /*      <Button onClick={() => disconnect()} variant="outline" color="red">*/
}
{
  /*        Отключить*/
}
{
  /*      </Button>*/
}
{
  /*    </Group>*/
}
{
  /*  )}*/
}
{
  /*</List>*/
}

{
  /*{isConnected ? (*/
}
{
  /*  <Group align="center">*/
}
{
  /*    <appkit-account-button />*/
}

{
  /*    <Title>*/
}
{
  /*      /&nbsp;*/
}
{
  /*      <Text className={classes.walletName} component="span" inherit>*/
}
{
  /*        {walletInfo?.name}*/
}
{
  /*      </Text>*/
}
{
  /*    </Title>*/
}
{
  /*    <Code color="teal" className={classes.status}>*/
}
{
  /*      Подключён*/
}
{
  /*    </Code>*/
}
{
  /*  </Group>*/
}
{
  /*) : (*/
}
{
  /*  <Center>*/
}
{
  /*    <appkit-connect-button />*/
}
{
  /*  </Center>*/
}
{
  /*)}*/
}

// }
// </Container>
// )
// ;
// })
// ;
