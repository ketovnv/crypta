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
  ScrollArea,
  Loader,
  Anchor,
  Box,
  Accordion,
} from "@mantine/core";
import { IoArrowForwardSharp } from "react-icons/io5";
import { useEffect } from "react";
import classes from "./Home.module.css";
import { Metamask } from "@components/Layout/SvgIcons/Metamask";
import { Google } from "@components/Layout/SvgIcons/Google";

import { walletStore } from "@/stores/wallet";
import { loggerStore } from "@/stores/logger";
import { eventsStore } from "@/stores/events.js";
import { LogJSON } from "@components/logger/LogJSON.jsx";
import AppearanceAnimation from "@animations/ivvolved/AppearanceAnimation.jsx";
import { animationStore } from "@stores/animation.js";
import { useSpring, animated } from "@react-spring/web";
import { uiStore } from "@stores/ui.js";
import { useDisconnect } from "@reown/appkit/react";
import { NavLink } from "react-router-dom";
import { BlackCoilTexture } from "@animations/Textures/BlackCoilTexture.js";
import { GrOpera } from "react-icons/gr";

// import BalanceTracker from "@components/Pages/Home/components/BallanceTracker.js";

const Home = observer(() => {
  // loggerStore.logWhiteRandom("🏩", " Компонент Home", 12);
  const { disconnect } = useDisconnect();
  const { navbarX } = animationStore;
  const closedWidth = window.innerWidth * 0.96; // 98% от ширины окна, когда навбар закрыт.  Можно в px
  const openWidth = window.innerWidth * 0.96 - 350; // 100% от ширины окна, когда навбар открыт.  Можно в px

  const springProps = useSpring({
    x: navbarX + 10,
    width: uiStore.isNavbarOpened ? openWidth : closedWidth, // Корректный calc
    from: { x: -350 + 10, width: openWidth },
    config: { mass: 1, tension: 280, friction: 60, delay: 200 },
  });

  return (
    <animated.div style={{ ...springProps, height: "600px" }}>
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
                  {walletStore.getWalletInformation()?.name ===
                    "io.metamask" && <Metamask />}
                  {walletStore.getWalletInformation()?.type === "injected" && (
                    <Box>
                      <Text className={classes.label}>Кошелёк</Text>
                      <Text className={classes.walletName}>
                        {walletStore.getWalletInformation()?.name}
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
                    {
                      walletStore.getNetwork().caipNetwork?.nativeCurrency
                        ?.symbol
                    }
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

              {walletStore.getNetwork() && (
                <Stack>
                  <Group>
                    <Anchor
                      href={
                        walletStore.getNetwork().caipNetwork?.rpcUrls?.default
                          .http[0]
                      }
                      target="_blank"
                    >
                      RPC
                    </Anchor>
                    <Anchor
                      href={
                        walletStore.getNetwork().caipNetwork?.rpcUrls
                          ?.chainDefault.http[0]
                      }
                      target="_blank"
                    >
                      RPC сети
                    </Anchor>
                    <Anchor
                      href={
                        walletStore.getNetwork()?.caipNetwork?.blockExplorers
                          .default.url
                      }
                      target="_blank"
                    >
                      {
                        walletStore.getNetwork()?.caipNetwork?.blockExplorers
                          .default.name
                      }
                    </Anchor>
                    <Anchor
                      href={
                        walletStore.getNetwork()?.caipNetwork?.blockExplorers
                          .default.apiUrl
                      }
                      target="_blank"
                    >
                      {
                        walletStore.getNetwork()?.caipNetwork?.blockExplorers
                          .default.name
                      }{" "}
                      API
                    </Anchor>
                  </Group>
                </Stack>
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
                        <Text
                          style={{ fontSize: 14 }}
                          className={classes.lable}
                        >
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
    </animated.div>
  );
});
export default Home;
