import {AppShell, Text} from "@mantine/core";
import { Outlet, useLocation } from "react-router-dom";
import { PageAnimation } from "@animations/involved/PageAnimation.jsx";
import {AnimatePresence} from "motion/react";
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
