// import AnimatedNumber      from "@components/Animations/AnimatedNumber.jsx";
import { AppShell, Group, Image } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import classes from "./MainHeader.module.css";
import { useEventListener } from "@mantine/hooks";
import { animated, config, useTrail, useTransition } from "@react-spring/web";
import { uiStore } from "@stores/ui";
import { motion } from "motion/react";

import { walletStore } from "@stores/wallet.js";
import ThemeToggle from "@components/Layout/MainHeader/ThemeToggle.jsx";

const SpringApp = ({ children }) => {
  const [up, set] = useState(true);
  const chars = useMemo(() => children.split(""), [children]);
  const trail = useTrail(chars.length, { x: up ? 0 : 25, opacity: up ? 1 : 0 });
  return (
    <div className={classes.content} onClick={() => set((a) => !a)}>
      {trail.map(({ x, ...rest }, index) => (
        <animated.div
          key={x + index}
          style={{
            ...rest,
            transform: x.to((x) => `translate3d(0,${x / 2}px,0)`),
          }}
        >
          {chars[index]}
        </animated.div>
      ))}
    </div>
  );
};

export const MainHeader = observer(() => {
  const ref = useEventListener("click", () => uiStore.toggleNavbarOpened());
  // if (!uiStore.navbarInterval) {
  //   uiStore.setNavbarInterval(
  //     setTimeout(() => {
  //       uiStore.toggleNavbarOpened();
  //     }, 3000),
  //   );
  // }

  const transitions = useTransition(!!walletStore.getAccountData(), {
    from: { opacity: 0, transform: "translateY(-20px)", scale: 0 }, // Входящая (начало)
    enter: { opacity: 1, transform: "translateY(0px)", scale: 1 }, // Входящая (конец)
    leave: { opacity: 0, transform: "translateY(20px)", scale: 0 }, // УХОДЯЩАЯ АНИМАЦИЯ
    config: { ...config.molasses }, // Настройки пружины
    keys: null,
  });

  return (
    <AppShell.Header
      className={classes.header}
      // style={{ background: animation.getThemeBackGround }}
      px="md"
      align="center"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
      >
        <Group position="apart" justify="space-between" h="100%" align="center">
          <Group ref={ref} className={classes.pressableGroup}>
            <motion.button
              style={{
                background: "none",
                borderWidth: 0,
                cursor: "pointer",
                borderRadius: 100,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { duration: 2 } }}
              whileHover={{
                scale: [1.2, 0.8, 1.2],
                transition: { duration: 1 },
              }}
              whileTap={{ scale: 0.8 }}
            >
              <Image
                src="/assets/bitcoin.svg"
                alt="Bitcoin"
                className={classes.appIcon}
              />
            </motion.button>

            <SpringApp className={classes.appName}>ReactAppKit</SpringApp>
          </Group>

          {transitions((style, item) =>
            item ? (
              <animated.div style={style}>
                <div
                  style={{ width: 300, height: 60, backgroundColor: "yellow" }}
                >
                  <appkit-button balance="show" />
                </div>
              </animated.div>
            ) : null,
          )}
        </Group>
        <ThemeToggle />
      </motion.div>
    </AppShell.Header>
  );
});
