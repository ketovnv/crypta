import classes from "./Layout.module.css";
import { Text, AppShell } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { MainNavbar } from "./MainNavbar";
import { MainHeader } from "./MainHeader";
import { loggerStore } from "@/stores/logger.js";
import { MainContent } from "./MainContent/index.js";
import { AppKitObserver } from "./AppKitObserver.ts";
import {uiStore} from "@stores/ui.js";

const Layout = observer(() => {
  useEffect(() => {
    loggerStore.info("🍰", " Layout mounted");
    return () => console.log("Layout unmounted");
  }, []);

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
      <MainContent />
    </AppShell>
  );
});

export default Layout;
