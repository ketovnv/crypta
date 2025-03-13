import { AppShell } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { MainNavbar } from "./MainNavbar";
import { MainHeader } from "./MainHeader";
import { loggerStore } from "@/stores/logger.js";
import { AppKitObserver } from "./AppKitObserver.ts";
import { routerStore } from "@stores/router.js";
import { motion } from "framer-motion";

import { animated, useSpring } from "@react-spring/web";
import { uiStore } from "@stores/ui.js";
import { animationStore } from "@stores/animation.js";

const Layout = observer(() => {
  useEffect(() => {
    loggerStore.info("🍰", " Layout mounted");
    return () => console.log("Layout unmounted");
  }, []);

  const { navbarX } = animationStore;
  const closedWidth = window.innerWidth * 0.8; // 98% от ширины окна, когда навбар закрыт.  Можно в px
  const openWidth = window.innerWidth * 0.8 - 350;

  const variants = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const springProps = useSpring({
    x: navbarX,
    width: uiStore.isNavbarOpened ? openWidth : closedWidth, // Корректный calc
    from: { x: -350, width: openWidth },
    config: { mass: 1, tension: 280, friction: 60, delay: 200 },
  });

  loggerStore.logRandomColors("LAYOUT", "mounted", 12);
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
      }}
      padding="md"
    >
      <AppKitObserver />
      <MainHeader />
      <MainNavbar />
      <AppShell.Main>
        {routerStore.getComponent()}

        <animated.div style={{ ...springProps, height: "600px" }}>
          {routerStore.isTransitioning ? (
            <motion.div key={routerStore.currentPath}>
              {routerStore.previousComponent}
            </motion.div>
          ) : (
            <motion.div
              key={routerStore.currentPath}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {routerStore.getComponent()}
            </motion.div>
          )}
        </animated.div>
      </AppShell.Main>
    </AppShell>
  );
});

export default Layout;
