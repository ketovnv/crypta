import { GlobalControlOldVariant } from "@components/classes/GlobalControlOldVariant.js";

GlobalControlOldVariant.interpolatorInit();
import { AppShell, MantineProvider } from "@mantine/core";
import { MainNavbar } from "./MainNavbar";
import { MainHeader } from "./MainHeader";
import { MainFooter } from "./MainFooter";
import { logger } from "@/stores/logger.js";
import { AppKitObserver } from "./AppKitObserver";
import { MainContent } from "@components/Layout/MainContent/index.js";
import { ErrorBoundary } from "@components/pages/ErrorNotification/ErrorBoundary.jsx";
import LoggerTest from "@components/LoggerTest.jsx";
// import { consoleGradient } from "@components/logger/ConsoleGradient.js";

const Layout = () => {
  // useEffect(() => {
  // document.body.setAttribute('data-motion-debug', 'true')
  // console.log('Layout mounted')
  // logger.info("🍰", " Layout mounted");
  // return () => console.log("Layout unmounted");
  // }, []);
  // console.log('LAYOUT')

  // logger.logRandomColors("LAYOUT", "mounted", 12);
  // consoleGradient("LAYOUT", "mounted", { fontSize: 20 });
  return (
    <ErrorBoundary>
      <MantineProvider>
        {/*<span>{JSON.stringify(eventsStore.state)}</span>*/}

        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
          }}
          style={{
            // scale:0.8,
            position: "absolute",
            left: 0,
            top: 0,
            width: "100vw",
            overflow: "hidden",
          }}
          padding={0}
        >
          <AppKitObserver />
          <MainHeader />
          <MainNavbar />
          {/*<LoggerTest />*/}
          <MainContent />
          <MainFooter />
        </AppShell>
      </MantineProvider>
    </ErrorBoundary>
  );
};

export default Layout;
