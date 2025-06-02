import "@reown/appkit-wallet-button/react";
import { observer } from "mobx-react-lite";
import { useAppKitTheme, useDisconnect } from "@reown/appkit/react";
import { logger } from "@stores/logger.js";
import React, { useEffect } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
} from "motion/react";

import { uiStore } from "@stores/ui.js";
import { walletStore } from "@stores/wallet.js";
import { animated } from "@react-spring/web";
import classes from "./Home.module.css";
import AppearingText from "@animations/Examples/AppearingText/AppearingText.js";
import { eventsStore } from "@stores/events.js";
import GradientText from "@animations/involved/GradientText.jsx";

import { Google } from "@components/Layout/SvgIcons/Google.jsx";
import { Metamask } from "@components/Layout/SvgIcons/Metamask.jsx";
import { Center, Group } from "@mantine/core";
import { gradientStore } from "@stores/gradient.js";
import { Skull } from "@components/Layout/SvgIcons/Skull.jsx";

const Home = observer(() => {
  logger.logWhiteRandom("🏩", " Компонент Home", 12);
  const { disconnect } = useDisconnect();
  const { setThemeVariables } = useAppKitTheme();
  const hue = useMotionValue(120);

  useEffect(() => {
    const unsubscribe = hue.on("change", (value) => {
      setThemeVariables({
        "--primary-hue": value,
        "--button-bg": `hsl(${value}, 100%, 50%)`,
      });
    });

    return () => unsubscribe();
  }, []);

  // const [ref, bounds, setBounds] = useMeasure({ scroll: true });
  // logger.setBounds(bounds);
  // return(<main><div style={{color: 'oklch(0.71 0.2086 263.9'}}>🏩 Hello Home!</div></main>    );

  return (
    <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
      <div className="relative flex flex-1 flex-col justify-between gap-3">
        <MotionConfig
          transition={{
            type: "spring",
            visualDuration: 1.5,
            bounce: 0.33,
          }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 360 }}
            style={{ x: hue }}
          >
            Перетащите для изменения цвета темы
          </motion.div>
          <Center h={65} w="100%">
            <AnimatePresence>
              {walletStore.getWalletInformation ? (
                <motion.a
                  layout
                  key={!!walletStore.getWalletInformation}
                  layoutId="button"
                  onClick={() => disconnect()}
                  className={classes.btnDisconnect}
                  animate={{ marginLeft: 200 }}
                  style={{
                    boxShadow: `0 5px ${uiStore.getRed}`,
                    background: gradientStore.circleGradient(
                      gradientStore.getRedGradient,
                      12,
                      10,
                      50,
                    ),
                  }}
                  whileTap={{
                    scale: 0,
                    opacity: 0,
                    transform: "translate3d(0, 4px, 0)",
                    boxShadow: `0 1px ${uiStore.getRed}`,
                  }}
                  whileHover="hover"
                  variants={{
                    hover: {
                      height: 70,
                      width: 70,
                      background: gradientStore.circleGradient(
                        gradientStore.getRedGradient,
                        12,
                        150,
                        -50,
                      ),
                    },
                  }}
                >
                  <Skull
                    width="4.5em"
                    style={{ opacity: 0, scale: 0.5, x: -5, y: 2 }}
                    layout
                    variants={{
                      initial: { opacity: 0 },
                      hover: { opacity: 1, x: 0, y: 10, scale: 1 },
                    }}
                  />
                  <motion.span
                    layoutId="button"
                    layout
                    variants={{
                      hover: { opacity: 0, scale: 0, top: 0, left: 0 },
                    }}
                    transition={{ duration: 2, hover: { duration: 0.2 } }}
                  >
                    Отключить
                  </motion.span>
                </motion.a>
              ) : (
                <motion.section
                  key={!walletStore.getWalletInformation}
                  transition={{ duration: 0.7 }}
                  initial={{ opacity: 0, scale: 0, position: "absolute" }}
                  animate={{ opacity: 1, scale: 1, x: -100 }}
                  exit={{ height: 0, scale: 0, x: 450, y: -300 }}
                  layout
                >
                  <appkit-button label="Подключить кошелёк" />
                </motion.section>
              )}
            </AnimatePresence>
          </Center>

          {walletStore.getNetwork.caipNetwork?.id &&
            !eventsStore.state?.open && (
              <motion.div
                layout
                style={{
                  padding: 20,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: 20,
                }}
              >
                <motion.div
                  layout
                  className={classes.label}
                  key={walletStore.getWalletInformation?.type}
                  transition={{ duration: 0.7 }}
                  initial={{ opacity: 0, width: 150 }}
                  style={{ space: 10, opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <AppearingText
                    speed={5}
                    fontSize={12}
                    key={walletStore.getNetwork?.caipNetwork?.id}
                    text={walletStore.getNetwork?.caipNetwork?.id + ".API:"}
                  />
                  <a
                    href={
                      walletStore.getNetwork.caipNetwork.blockExplorers.default
                        .url
                    }
                    target="_blank"
                  >
                    <GradientText colors={uiStore.theme.navBarButtonText}>
                      <AppearingText
                        speed={3}
                        key={walletStore.getNetwork?.caipNetwork?.id}
                        text={
                          walletStore.getNetwork.caipNetwork.blockExplorers
                            .default.name
                        }
                      />
                    </GradientText>
                  </a>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <appkit-network-button />
                </motion.div>
                {walletStore.getNetwork?.caipNetwork.testnet && (
                  <motion.span
                    layout
                    initial={{ marginLeft: 42 }}
                    animate={{
                      marginLeft: 42,
                      color: uiStore.getGreen,
                    }}
                    transition={{ duration: 5 }}
                    className={classes.testNetwork}
                  >
                    Тестовая сеть
                  </motion.span>
                )}
              </motion.div>
            )}

          {walletStore.getAccountData?.isConnected && (
            <motion.div
              animate={{
                marginLeft: 25,
                marginRight: 25,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              {walletStore.getWalletInformation?.type !== "WALLET_CONNECT" ? (
                <motion.span
                  layout
                  className="text-shadow-[0px_0px_20px_0px_rgba(0,0,255,0.8)]"
                >
                  Социальный аккаунт&nbsp;
                  {walletStore.getWalletInformation?.name !== "ID_AUTH"
                    ? walletStore.getWalletInformation?.social
                    : ""}
                </motion.span>
              ) : (
                <motion.span layout className={classes.label}>
                  Кошелёк
                </motion.span>
              )}
            </motion.div>
          )}

          {walletStore.getAccountData?.isConnected &&
            walletStore.getWalletInformation?.name &&
            !eventsStore.state?.open && (
              <motion.div
                key={walletStore.getWalletInformation?.type} // layout
                transition={{ duration: 0.7 }}
                initial={{ opacity: 0 }}
                style={{
                  space: 10,
                  opacity: 0,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flesh-start",
                }}
                animate={{ opacity: 1, x: -22 }}
                exit={{
                  opacity: 0,
                }}
              >
                <motion.span style={{ opacity: 1 }}>
                  {walletStore.getWalletInformation?.type !==
                  "WALLET_CONNECT" ? (
                    <Google />
                  ) : (
                    <Metamask />
                  )}
                </motion.span>
                <GradientText>
                  <AppearingText
                    speed={25}
                    fontSize={20}
                    fontWeight={700}
                    className={classes.walletAddress}
                    text={walletStore.getAccountData.address}
                  />
                </GradientText>
              </motion.div>
            )}

          <Group justify="flex-end" pr={20} w="75%">
            <GradientText colors={uiStore.theme.navBarActiveButtonText}>
              <motion.span
                layout
                style={{
                  fontFamily: "Nunito",
                  fontSize: 38,
                  fontOpticalSizing: "auto",
                  fontStyle: "normal",
                  fontWeight: 1000,
                  textShadow: "2px 0px 0px rgba(255, 255, 0, 0.1)",
                  scale: 1,
                  x: 20,
                }}
                animate={{
                  x: 150,
                  scale: 0.95,
                  fontWeight: 500,
                  textShadow: "-3px 0px 0px rgba(255, 255, 0, 0.3)",
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                {walletStore.getWalletInformation?.type === "injected"
                  ? walletStore.getWalletInformation?.name
                  : walletStore.getWalletInformation?.name !== "ID_AUTH"
                    ? walletStore.getWalletInformation?.name
                    : walletStore.getAccountData?.embeddedWalletInfo?.user
                        .email}
              </motion.span>
            </GradientText>
          </Group>
        </MotionConfig>
      </div>
    </div>
  );
});
export default Home;
