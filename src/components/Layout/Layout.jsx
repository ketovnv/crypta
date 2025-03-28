import { AppShell, ColorSchemeScript, MantineProvider } from "@mantine/core";
import React, { useEffect } from "react";
import { MainNavbar } from "./MainNavbar";
import { MainHeader } from "./MainHeader";
import { MainFooter } from "./MainFooter";
import { logger } from "@/stores/logger.js";
import { AppKitObserver } from "./AppKitObserver";
import { ErrorBoundary } from "@components/pages/ErrorNotification/ErrorBoundary.jsx"; // import PageTransition from "@animations/current/PageTransitions/Gpt(Gilmor)";
import { MainContent } from "@components/Layout/MainContent/index.js";
import { useSpring } from "@react-spring/web";
import { animation } from "@stores/animation.js";
import { toJS } from "mobx";
import { theme } from "@styles/theme.js";

const Layout = () => {
  const [styles, api] = useSpring(() => ({
    background: "linear-gradient(45deg, #ecf0f1, #bdc3c7)",
    config: { tension: 200, friction: 30 },
  }));

  useEffect(() => {
    animation.setSpringApi(toJS(api)); // Передаём API в MobX
  }, [api]);

  useEffect(() => {
    console.log("Layout mounted");
    // logger.info("🍰", " Layout mounted");
    return () => console.log("Layout unmounted");
  }, []);

  console.log("LAYOUT");

  logger.logRandomColors("LAYOUT", "mounted", 12);
  return (
    <ErrorBoundary>
      <ColorSchemeScript defaultColorScheme="dark" forceColorScheme="dark" />
      <MantineProvider theme={theme}>
        <AppShell
          // layout="alt"
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
          }}
          style={{ overflow: "hidden" }}
          padding="md"
        >
          <AppKitObserver />
          <MainHeader />
          <MainNavbar />
          <MainContent />
          <MainFooter />
        </AppShell>
      </MantineProvider>
    </ErrorBoundary>
  );
};

export default Layout;
