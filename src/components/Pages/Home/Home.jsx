import "@reown/appkit-wallet-button/react";
import { observer } from "mobx-react-lite";
import {
  Accordion,
  Anchor,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import classes from "./Home.module.css";
import { Metamask } from "@components/Layout/SvgIcons/Metamask";
import { Google } from "@components/Layout/SvgIcons/Google";

import { walletStore } from "@/stores/wallet";
import { eventsStore } from "@/stores/events.js";
import AppearanceAnimation from "@animations/involved/AppearanceAnimation";
import { useSpring } from "@react-spring/web";
import { useDisconnect } from "@reown/appkit/react";
import { BlackCoilTexture } from "@animations/involved/textures/BlackCoilTexture.js";
import {logger} from "@stores/logger.js";

const Home = observer(({ isLeaving }) => {
  const props = useSpring({
    opacity: isLeaving ? 0 : 1,
    transform: isLeaving ? "translate3d(0,-40px,0)" : "translate3d(0,0px,0)",
    config: { duration: isLeaving ? 500 : undefined }, // Different duration for exit
  });
  logger.logWhiteRandom("🏩", " Компонент Home", 12);
  const { disconnect } = useDisconnect();

  return (
    <Group h="600px" mw={600} justify="center" align="flex-start">
      <AppearanceAnimation condition={eventsStore.getState()?.loading}>
        <Loader />
      </AppearanceAnimation>
      <AppearanceAnimation
        condition={
          !eventsStore.getState()?.open && !eventsStore.getState()?.loading
        }
      >
        {walletStore.getAccountData() && (
          <Center w={600} style={{ position: "relative", top: -25 }}>
            <appkit-button balance="show" />
          </Center>
        )}
        <BlackCoilTexture background="#010102">
          <Stack>
            <Group justify="space-between" align="center">
              <Group align="center">
                {walletStore.getWalletInformation()?.social === "google" && (
                  <Google />
                )}
                {walletStore.getWalletInformation()?.social && (
                  <Box>
                    <Text className={classes.label}>
                      Социальный аккаунт&nbsp;
                      {walletStore.getWalletInformation()?.social}
                    </Text>
                    <Text className={classes.walletName}>
                      {walletStore.getWalletInformation()?.identifier}
                    </Text>
                  </Box>
                )}
                {walletStore.getWalletInformation()?.name === "io.metamask" && (
                  <Metamask />
                )}
                {walletStore.getWalletInformation()?.type === "injected" && (
                  <Box>
                    <Text className={classes.label}>Кошелёк</Text>
                    <Text className={classes.walletName}>
                      `{walletStore.getWalletInformation()?.name}
                    </Text>
                  </Box>
                )}
              </Group>
              {walletStore.getAccountData() ? (
                <Button
                  onClick={() => disconnect()}
                  variant="outline"
                  color="red"
                >
                  Отключить
                </Button>
              ) : (
                <Center w={600}>
                  <appkit-button label="Подключить кошелёк" />
                </Center>
              )}
            </Group>
            {walletStore.getNetwork() && (
              <Group>
                <Text className={classes.label}>
                  {walletStore.getNetwork().caipNetwork?.nativeCurrency?.symbol}
                </Text>
                <appkit-network-button />
                {walletStore.getNetwork()?.caipNetwork.testnet && (
                  <Text className={classes.testNetwork}>Тестовая сеть</Text>
                )}
              </Group>
            )}
            {walletStore.getAccountData() && (
              <Box>
                <Group justify="space-between">
                  <Text className={classes.label}>Адресс</Text>
                  <Text className={classes.walletAddress}>
                    {walletStore.getAccountData().address}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text className={classes.label}>Адресс caip</Text>
                  <Text className={classes.walletAddress}>
                    {walletStore.getAccountData().caipAddress}
                  </Text>
                </Group>
              </Box>
            )}            
          </Stack>
        </BlackCoilTexture>

        {walletStore.getNetwork() && (
          <Accordion w={600} mx="auto" variant="separated">
            <Accordion.Item value="contracts">
              <Accordion.Control>
                <Title order={4} className={classes.lable}>
                  Контракты
                </Title>
              </Accordion.Control>
              <Accordion.Panel>
                {Object.entries(
                  walletStore.getNetwork()?.caipNetwork.contracts,
                ).map(([key, val]) => (
                  <Box key={key}>
                    <Group>
                      <Text style={{ fontSize: 14 }} className={classes.lable}>
                        {key + " : "}
                      </Text>
                      <Text
                        style={{ fontSize: 14 }}
                        className={classes.walletAddress}
                      >
                        {val.address}
                      </Text>
                      {val.blockCreated && (
                        <Text style={{ fontSize: 12 }}>
                          Номер блока:{val.blockCreated}
                        </Text>
                      )}
                    </Group>
                  </Box>
                ))}

                <Group>
                  <Text>Assets</Text>
                  <Text>
                    {JSON.stringify(
                      walletStore.getNetwork().caipNetwork?.assets,
                    )}
                  </Text>
                </Group>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}
        {/*<BalanceTracker />*/}
      </AppearanceAnimation>
    </Group>
  );
});
export default Home;
