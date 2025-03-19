import {AppShell, Loader, Center} from "@mantine/core";
import { observer } from "mobx-react-lite";
import React from "react";
import { useEffect } from "react";
import { MainNavbar } from "./MainNavbar";
import { MainHeader } from "./MainHeader";
import { MainFooter } from "./MainFooter";
import { logger } from "@/stores/logger.js";
import { AppKitObserver } from "./AppKitObserver";
import { routerStore } from "@stores/router.js";
import loadable from '@loadable/component'
 const AsyncPage = loadable(props => import(`../pages/${props.page}`), {
   cacheKey: props => props.page,
 })

import {IoApertureSharp, IoFileTrayFullSharp, IoLogoReact, IoWallet} from "react-icons/io5";


import { animated, useSpring } from "@react-spring/web";
import { uiStore } from "@stores/ui.js";
import { animationStore } from "@stores/animation.js";

const Layout = observer(() => {

  useEffect(() => {
    console.log("Layout mounted")
    // logger.info("🍰", " Layout mounted");
    return () => console.log("Layout unmounted");
  }, []);

  const { navbarX } = animationStore;
  const closedWidth = window.innerWidth * 0.8;
  const openWidth = window.innerWidth * 0.8 - 350;

  const variants = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  const springProps = useSpring({
    x: navbarX,
    width: uiStore.isNavbarOpened ? openWidth : closedWidth,
    from: { x: -350, width: openWidth },
    config: { mass: 1, tension: 280, friction: 60, delay: 200 },
  });
  console.log("LAYOUT")

  logger.logRandomColors("LAYOUT", "mounted", 12);
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

        <AsyncPage page={routerStore.getPageElement} fallback={<Center><Loader/></Center>}/>


        {/*{routerStore.getPage&& <AsyncPage page={routerStore.getPage}/>}         /!*<animated.div style={{ ...springProps, height: "600px" }}>*!/*/}
         {/*  {routerStore.isTransitioning ? (*/}
         {/*    <motion.div key={routerStore.currentPath}>*/}
         {/*      {routerStore.previousComponent}*/}
         {/*    </motion.div>*/}
         {/*  ) : (*/}
         {/*    <motion.div*/}
         {/*      key={routerStore.currentPath}*/}
         {/*      variants={variants}*/}
         {/*      initial="hidden"*/}
         {/*      animate="visible"*/}
         {/*      exit="exit"*/}
         {/*      transition={{ duration: 0.5, ease: "easeInOut" }}*/}
         {/*    >*/}
         {/*      {routerStore.getComponent()}*/}
         {/*    </motion.div>*/}
         {/*  )}*/}
         {/*</animated.div>*/}
      </AppShell.Main>
      <MainFooter />
     </AppShell>
   );
});


export default Layout;
