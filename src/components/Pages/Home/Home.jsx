import "@reown/appkit-wallet-button/react";
import { observer } from "mobx-react-lite";
import { Center } from "@mantine/core";
import { useDisconnect } from "@reown/appkit/react";
import { logger } from "@stores/logger.js";
import React from "react";
import { motion, MotionConfig } from "motion/react";
import { animation } from "@stores/animation.js";
import { uiStore } from "@stores/ui.js";
import { walletStore } from "@stores/wallet.js";
import classes from "./Home.module.css";
import chroma from "chroma-js";
import { AwesomeButton } from "@animations/current/AwesomeButton/AwesomeButton.js";

const Home = observer(() => {
  logger.logWhiteRandom("🏩", " Компонент Home", 12);
  const { disconnect } = useDisconnect();
  // const [ref, bounds, setBounds] = useMeasure({ scroll: true });
  // logger.setBounds(bounds);

  logger.logJSON("gradients", JSON.stringify(animation.theme));

  const { background, color, pageCardShadow } = { ...animation.theme };

  return (
    <Center
      // ref={ref}
      className="pageWrapper"
    >
      <MotionConfig
        transition={{
          type: "spring",
          visualDuration: 5,
          bounce: 0.1,
        }}
      >
        <motion.div
          layout
          className="pageCard"
          animate={{
            background,
            color,
            boxShadow: pageCardShadow,
          }}
        >
          {Object.keys(animation.theme).map((key) => {
            return (
              <motion.div
                layout
                key={key}
                animate={{
                  color: "rgba(" + chroma.random()._rgb + ")",
                  background: animation.theme[key],
                  width: 450,
                  borderRadius: 20,
                }}
                m={1}
              >
                {/*{JSON.stringify(chroma.random()._rgb)}*/}
                {animation.theme[key]}
              </motion.div>
            );
          })}
          <motion.div
            style={{ display: "flex", flexDirection: "row" }}
            justify="space-between"
            align="center"
          >
            {walletStore.getWalletInformation()?.social === "google" && (
              <Google />
            )}
            {walletStore.getWalletInformation()?.social && (
              <motion.div display="inline">
                <motion.span className={classes.label}>
                  Социальный аккаунт&nbsp;
                  {walletStore.getWalletInformation()?.social}
                </motion.span>
                <motion.span className={classes.walletName} animate={{ color }}>
                  {walletStore.getWalletInformation()?.identifier}
                </motion.span>
              </motion.div>
            )}
            {walletStore.getWalletInformation()?.name === "io.metamask" && (
              <Metamask />
            )}
            {walletStore.getWalletInformation()?.type === "injected" && (
              <animated.div>
                <motion.span animate={{ color }} className={classes.label}>
                  Кошелёк
                </motion.span>
                <motion.span animate={{ color }} className={classes.walletName}>
                  `{walletStore.getWalletInformation()?.name}
                </motion.span>
              </animated.div>
            )}

            {walletStore.getAccountData() ? (
              <AwesomeButton
                onPress={() => disconnect()}
                style={{
                  padding: 2,
                  width: 295,
                  color: "red",
                }}
                whileTap={{ scale: 0.99 }}
                whileHover={{ scale: 1.01 }}
                type="disconnectButton"
                buttonKey={"disconnected" + walletStore.isConnected}
                key={"disconnected" + walletStore.isConnected}
              >
                Отключить
              </AwesomeButton>
            ) : (
              <motion.div style={{ width: 550 }}>
                <appkit-button label="Подключить кошелёк" />
              </motion.div>
            )}
          </motion.div>
          {walletStore.getNetwork() && (
            <motion.div style={{ display: "flex", flexDirection: "row" }}>
              <motion.span className={classes.label}>
                {walletStore.getNetwork().caipNetwork?.nativeCurrency?.symbol}
              </motion.span>
              <appkit-network-button />
              {walletStore.getNetwork()?.caipNetwork.testnet && (
                <motion.span
                  animate={{
                    color: `oklch(${uiStore.themeIsDark ? 0.9 : 0.5} 0.166 147.29)`,
                  }}
                  transition={{ duration: 5 }}
                  className={classes.testNetwork}
                >
                  Тестовая сеть
                </motion.span>
              )}
            </motion.div>
          )}
          {walletStore.getAccountData() && (
            <motion.div>
              <motion.div>
                <motion.span className={classes.label}>Адресс</motion.span>
                <motion.span className={classes.walletAddress}>
                  {walletStore.getAccountData().address}
                </motion.span>
              </motion.div>
              <motion.div>
                <motion.span className={classes.label}>Адресс caip</motion.span>
                <motion.span className={classes.walletAddress}>
                  {walletStore.getAccountData().caipAddress}
                </motion.span>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </MotionConfig>
    </Center>
  );
});
export default Home;
