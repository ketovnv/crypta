import classes from "./Layout.module.css";
import { Text, AppShell } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { MainNavbar } from "./MainNavbar";
import { MainHeader } from "./MainHeader";
import { loggerStore } from "@/stores/logger.js";
import { MainContent } from "./MainContent/index.js";
import { AppKitObserver } from "./AppKitObserver.ts";
import { useLocation } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";

const Layout = observer(() => {
  useEffect(() => {
    // loggerStore.info("🍰 Layout mounted");
    return () => console.log("Layout unmounted");
  }, []);

  // loggerStore.warning("LAYOUT");

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
      }}
      padding="md"
    >
      {/*<AppKitObserver />*/}
      <MainHeader />
     <MainNavbar />
      <MainContent location={location} />
    </AppShell>
  );
});

export default Layout;
