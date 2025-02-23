import classes from "./Layout.module.css";
import { motion, AnimatePresence } from "framer-motion";

//import {PageTransition}      from "@components/Layout/PageTransition";
import { AppShell } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MainNavbar } from "./MainNavbar";
import { MainHeader } from "./MainHeader";
import {loggerStore} from "@/stores/logger.js";


const Layout = observer(() => {
  useEffect(() => {
    loggerStore.debug('Layout mounted');
    return () => console.log('Layout unmounted');
  }, []);
  // console.error('RENDER!!!');

  const animations = {
    initial: { opacity: 0, y: 1000 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -1000 },
  };

  const location = useLocation();

  loggerStore.debug("Приложение запущено!!!");
  const PageAnimation = ({children}) => (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 1 }}
    >
      <AnimatePresence exitBeforeEnter>{children}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
      }}
      padding="md"
    >
      <MainHeader />
      <MainNavbar />
      <AppShell.Main>
        <PageAnimation>
          <Outlet  location={location} key={location.pathname} />
        </PageAnimation>
      </AppShell.Main>
    </AppShell>
  );
});

export default Layout;
