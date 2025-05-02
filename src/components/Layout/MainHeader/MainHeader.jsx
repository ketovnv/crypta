// import AnimatedNumber      from "@components/Animations/AnimatedNumber.jsx";
// @ts-ignore
// @ts-ignore

import { AppShell, Group } from "@mantine/core";
import { observer } from "mobx-react-lite";
import classes from "./MainHeader.module.css";
import { useEventListener } from "@mantine/hooks";
import { animated, config, useTransition } from "@react-spring/web";
import { uiStore } from "@stores/ui";
import { motion } from "motion/react";
import { SpringAppName } from "@animations/involved/units/SpringAppName";
import HeaderBitcoin from "@components/Layout/SvgIcons/HeaderBitcoin";
import { walletStore } from "@stores/wallet.js";
import ThemeToggle from "@components/Layout/MainHeader/ThemeToggle.jsx";

export const MainHeader = observer(() => {
  const ref = useEventListener("click", () => uiStore.toggleNavbarOpened());

  const transitions = useTransition(!!walletStore.getAccountData, {
    from: {
      opacity: 0,
      transform: "translateY(-50px)",
      scale: 0,
      filter: "blur(10px)",
    }, // Входящая (начало)
    enter: {
      opacity: 1,
      transform: "translateY(0px)",
      top: 15,
      scale: 1,
      filter: "blur(0px)",
    }, // Входящая (конец)
    leave: {
      opacity: 0,
      transform: "translateY(-50px)",
      scale: 0,
      filter: "blur(10px)",
    }, // УХОДЯЩАЯ АНИМАЦИЯ
    config: { ...config.molasses }, // Настройки пружины
    keys: null,
  });

  return (
    <AppShell.Header className={classes.header} align="center">
      <motion.div
        layout
        style={{ width: "100wv" }}
        initial={{
          opacity: 0,
          rotateY: 10,
          y: -60,
          filter: "blur(10px)",
        }}
        animate={{
          rotateY: 0,
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
      >
        <Group ref={ref} className={classes.pressableGroup} w="50%">
          <motion.button
            style={{
              background: "none",
              borderWidth: 0,
              cursor: "pointer",
              borderRadius: 100,
            }}
            transition={{ type: "spring", stiffness: 100, friction: 15, mass: 15, damping: 10 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1,}}
            whileHover={{              scale: 1.2,

            }}
            whileTap={{ scale: 0.7,}}
          >
            <HeaderBitcoin  isDark={uiStore.themeIsDark}/>
          </motion.button>
          <SpringAppName />
        </Group>
        {transitions((style, item) =>
          item ? (
            <animated.div
              style={{
                ...style,
                position: "absolute",
                right: 175,
                color: "blue !important",
              }}
              key={item}
            >
              <appkit-button balance="show" />
            </animated.div>
          ) : null,
        )}
        <ThemeToggle
          isDark={uiStore.themeIsDark}
          setColorScheme={uiStore.setColorScheme}
        />
      </motion.div>
    </AppShell.Header>
  );
});
