import "@reown/appkit-wallet-button/react";
import {observer} from "mobx-react-lite";
import {Text} from "@mantine/core";
import {useDisconnect} from "@reown/appkit/react";
import {logger} from "@stores/logger.js";
import React from "react";
import {AnimatePresence, motion, MotionConfig} from "motion/react";
import {uiStore} from "@stores/ui.js";
import {walletStore} from "@stores/wallet.js";
import {animated} from "@react-spring/web";
import {Metamask} from "@components/Layout/SvgIcons/Metamask";
import {Google} from "@components/Layout/SvgIcons/Google";

import classes from "./Home.module.css";
import {AwesomeButton} from "@animations/current/AwesomeButton/AwesomeButton.js";
import AppearingText from "@animations/Examples/AppearingText/AppearingText.js";
import {eventsStore} from "@stores/events.js";
import {LJ} from "@components/logger/LJ.jsx";
import {gradientStore} from "@stores/gradient.js";



const Home = observer(() => {
  logger.logWhiteRandom("🏩", " Компонент Home", 12);
  const { disconnect } = useDisconnect();
  // const [ref, bounds, setBounds] = useMeasure({ scroll: true });
  // logger.setBounds(bounds);
// return(<main><div style={{color: 'oklch(0.71 0.2086 263.9'}}>🏩 Hello Home!</div></main>    );

  return (
      <main
      className="pageWrapper"
    >

      <MotionConfig
        transition={{
          type: "spring",
            visualDuration: 1.5,
            bounce: 0.33,
        }}
      >
          <animated.section className="pageCard" style={uiStore.themeStyle}>
              <AwesomeButton
                  onPress={() => disconnect()}
                  style={{
                      top: 5,
                      right: 10,
                      padding: 2,
                      width: 300,
                      minWidth: 100,
                      height: 44,
                      color: 'oklch(0.73 0.2577 29.23)',
                  }}
                  whileTap={{scale: 0.9}}
                  whileHover={{scale: 1.01}}
                  type="disconnectButton"
                  buttonKey={"disconnected" + walletStore.isConnected}
                  key={"disconnected" + walletStore.isConnected}
              >
                  Отключить
              </AwesomeButton>
              {walletStore.getNetwork && !eventsStore.state?.open && (
                  <motion.div
                      layout
                      style={{
                          padding: 20,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          margin: 20
                      }}
                  >
                      <AppearingText key={walletStore.getNetwork?.id} text={walletStore.getNetwork?.id??''}/>
                      <motion.span
                          whileHover={{scale: 1.03}}
                          whileTap={{scale: 0.96}}
                          layout>
                          <appkit-network-button/>
                      </motion.span>

                      {walletStore.getNetwork?.caipNetwork.testnet && (
                          <motion.span
                              layout
                              animate={{
                                  marginLeft: 20,
                                  color: `oklch(${uiStore.themeIsDark ? 0.9 : 0.5} 0.166 147.29)`,
                              }}
                              transition={{duration: 5}}
                              className={classes.testNetwork}
                          >
                              Тестовая сеть
                          </motion.span>
                      )}
                  </motion.div>
              )}
              {/*<LJ json={av}/>*/}
              <AnimatePresence>
              <motion.div
                  layout
                  style={{display: "flex", flexDirection: "row"}}
                  justify="space-between"
                  align="center"
              >

                  {(!walletStore.getWalletInformation && !eventsStore.state?.open) &&
                      <motion.section
                          initial={{height: 0}}
                          animate={{height: 100}}
                          exit={{height: 0, scale: 0, x: 450, y: -300}}
                          key="apb"
                          layout
                      >
                          <appkit-button label="Подключить кошелёк"/>
                      </motion.section>
                  }


                  {(walletStore.getWalletInformation?.name && !eventsStore.state?.open) &&
                      <motion.div
                          key="wallet-info"
                          layout
                          animate={{display: "flex", flexDirection: "row", alignItems: "center", space: 10}}>
                          {walletStore.getWalletInformation?.type !== "WALLET_CONNECT" ?
                              <Google/> :
                              <Metamask/>
                          }
                          <motion.div layout animate={{paddingLeft: 10, paddingRight: 10, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center"}}>
                              {walletStore.getWalletInformation?.type !== "WALLET_CONNECT"
                                  ?
                                  <Text className={classes.label}>
                                      Социальный аккаунт&nbsp;
                                      {walletStore.getWalletInformation?.name !== "ID_AUTH" ? walletStore.getWalletInformation?.social : ''}
                                  </Text>
                                  :
                                  <Text className={classes.label}>Кошелёк</Text>}


                              <Text className={classes.walletName}>
                                  {walletStore.getWalletInformation?.type === "injected" ?
                                      walletStore.getWalletInformation?.name :
                                      (walletStore.getWalletInformation?.name !== "ID_AUTH" ? walletStore.getWalletInformation?.name : walletStore.getAccountData?.embeddedWalletInfo?.user.email)}
                              </Text>
                          </motion.div>

                      </motion.div>}

              </motion.div>

                  {walletStore.getAccountData && (
                      <motion.div key="address" layout>
                          <motion.div className={classes.label}>Адресс</motion.div>
                          <AppearingText speed={25} className={classes.walletAddress}
                                         text={walletStore.getAccountData.address}/>
                      </motion.div>)}
              </AnimatePresence>
          </animated.section>
      </MotionConfig>
      </main>
  );
});
export default Home;
