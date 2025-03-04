import {AppShell, Text} from "@mantine/core";
import { Outlet, useLocation } from "react-router-dom";
import { PageAnimation } from "@components/Animations/FramerMotion/PageAnimation.jsx";
import {AnimatePresence} from "framer-motion";
import {uiStore} from "@stores/ui.js";

export const MainContent = () => {
  const location = useLocation();

  return (
    <AppShell.Main>
        <Text>{uiStore.colorScheme}</Text>
      <AnimatePresence mode="wait" initial={false}>
        <PageAnimation key={location.pathname}>
          <Outlet/>
        </PageAnimation>
      </AnimatePresence>
    </AppShell.Main>
  );
};
