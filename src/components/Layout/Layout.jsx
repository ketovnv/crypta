import { AppShell } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { MainNavbar } from "./MainNavbar";
import { MainHeader } from "./MainHeader";
import { loggerStore } from "@/stores/logger.js";
import { AppKitObserver } from "./AppKitObserver.ts";
import {routerStore} from "@stores/router.js";
import { Suspense } from "react";
import { ROUTES_LAZY, ROUTE_URLS } from "../pages/routes.jsx";

const Layout = observer(() => {

  const currentRoute =
    ROUTES_LAZY[routerStore.currentPath] || ROUTES_LAZY.WALLET;
  useEffect(() => {
    loggerStore.info("🍰", " Layout mounted");
    return () => console.log("Layout unmounte d");
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

      {routerStore.isTransitioning ? (
        // Отображаем предыдущий компонент во время перехода
        routerStore.previousComponent
      ) : (
        // Отображаем новый компонент с Suspense
        <Suspense fallback={<div>Loading...</div>}>
          <currentRoute.element />
        </Suspense>
      )}
    </AppShell>
  );
});

export default Layout;
