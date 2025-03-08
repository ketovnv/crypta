// import AnimatedNumber      from "@components/Animations/AnimatedNumber.jsx";
import {
  Text,
  Group,
  ActionIcon,
  useMantineColorScheme,
  AppShell,
  Burger,
  Image,
  Button,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import {useEffect, useMemo, useState} from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import classes from "./MainHeader.module.css";
import { routerStore } from "@/stores/router.ts";
import { useNavigate } from "react-router";
import { uiStore } from "@stores/ui.js";
import { motion } from "framer-motion";
import { useEventListener } from "@mantine/hooks";
import {
  useTrail,
  animated,
} from '@react-spring/web'

const SpringApp = ({ children}) => {
  const [up, set] = useState(true);
  const chars = useMemo(() => children.split(''), [children]);
  const trail = useTrail(chars.length, { x: up ? 0 : 50, opacity: up ? 1 : 0});
  return (
      <div className={classes.content} onClick={() => set(a => !a)}>
        {trail.map(({ x, ...rest }, index) => (
            <animated.div key={x+index} style={{ ...rest, transform: x.to(x => `translate3d(0,${x}px,0)`) }}>{chars[index]}</animated.div>
        ))}
      </div>
  )
}//

//
//
export const MainHeader = observer(() => {
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  let dark = colorScheme === "dark";
  const ref = useEventListener("click", ()=>uiStore.toggleNavbarOpened());
  if (!uiStore.navbarInterval) {
    uiStore.setNavbarInterval(
      setTimeout(() => {
        uiStore.toggleNavbarOpened();
      }, 3000),
    );
  }

  return (
    <AppShell.Header className={classes.header} px="md" align="center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Group
          position="apart"
          justify="space-between"
          h="100%"
          align="center"
        >
          <Group ref={ref} className={classes.pressableGroup}>
            <Image
              src="/assets/bitcoin.svg"
              alt="Bitcoin"
              className={classes.appIcon}
            />
            <SpringApp className={classes.appName}>React AppKit Reown</SpringApp>
          </Group>
          <ActionIcon
            size="lg"
            variant="outline"
            color={dark ? "yellow" : "blue"}
            onClick={() =>
              setColorScheme(colorScheme === "light" ? "dark" : "light")
            }
            title="Toggle color scheme"
          >
            {!dark ? <FiSun size={32} /> : <FiMoon size={32} />}
          </ActionIcon>
        </Group>
      </motion.div>
    </AppShell.Header>
  );
});
