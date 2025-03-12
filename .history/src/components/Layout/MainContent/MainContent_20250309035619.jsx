import {AppShell, Text} from "@mantine/core";
import { Outlet, useLocation } from "react-router-dom";
import { PageAnimation } from "@animations/FramerSpring/PageAnimation.jsx";
import {AnimatePresence} from "framer-motion";
import {uiStore} from "@stores/ui.js";

export const MainContent = () => {
  const location = useLocation();

  return (
    <AppShell.Main>
      <AnimatePresence mode="wait" initial={false} >
        <PageAnimation key={location.key}>
          <Outlet/>
        </PageAnimation>
      </AnimatePresence>
    </AppShell.Main>
  );
};
