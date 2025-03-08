import {
  AppShell,
  Text,
  Center,
  NavLink as MantineLink,
  ThemeIcon,
  Accordion,
  List,
  ScrollArea,
} from "@mantine/core";
import { NavLink as Link } from "react-router-dom";
import {
  FiHome,
  FiSettings,
  FiUser,
  FiBookmark,
  FiMessageSquare,
} from "react-icons/fi";
import classes from "./MainNavbar.module.css";
import { Web3Inch } from "../SvgIcons/Web3Inch.jsx";
import { observer } from "mobx-react-lite";
import { ROUTES, ROUTE_META } from "../../Pages/routes.tsx";
import { eventsStore } from "@/stores/events.js";
import { LogJSON } from "@components/logger/LogJSON.jsx";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { uiStore } from "@stores/ui.js";
import { animationStore } from "@stores/animation.js";

export const MainNavbar = observer(() => {

  const controls = useAnimation();

  useEffect(() => {
    if (uiStore.isNavbarOpened) {
      controls.start("visible");
      animationStore.setNavbarX(0);
    } else {
      controls.start("hidden");
      animationStore.setNavbarX(-350);
    }
  }, [uiStore.isNavbarOpened]);
  const navbarVariants = {
    hidden: { x: -350 },
    visible: { x: 0 },
  };

  return (
    <motion.div
      variants={navbarVariants}
      initial="hidden"
      animate={controls}
      transition={{ duration: .5, ease: "easeInOut" }}
    >
      <AppShell.Navbar
        className={classes.navbar}
        p="md"
        // hidden={!uiStore.isBurgerOpened}
        width={{ base: 300 }}
      >
        <Center width={{ sm: 200, lg: 300 }}>
          <Web3Inch color1="yellow" color2="red" />
        </Center>

        {Object.entries(ROUTES).map(([key, path]) => {
          const meta = ROUTE_META[path];

          return (
            <MantineLink
              className={classes.link}
              leftSection={meta.icon}
              component={Link} // импортируйте Link из react-router-dom
              to={path}
              key={meta.title}
              label={meta.title}
            />
          );
        })}
        <ScrollArea mx="auto" w={300} h={200}>
          {eventsStore.eventsList.map((event) => (
            <Accordion
              variant="separated"
              key={event.timestamp}
              w={300}
              mx="auto"
            >
              <Accordion.Item
                className={classes.accordionItem}
                value={event.data?.event}
              >
                <Accordion.Control>
                  {new Date(event.timestamp).toLocaleString() +
                    " " +
                    event.data?.event}
                </Accordion.Control>
                <Accordion.Panel>
                  <LogJSON
                    label={event.data?.event}
                    json={event?.data?.properties}
                    fontSize={10}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          ))}
        </ScrollArea>
      </AppShell.Navbar>
    </motion.div>
  );
});
