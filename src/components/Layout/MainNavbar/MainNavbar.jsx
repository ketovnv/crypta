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
import classes from "./MainNavbar.module.css";
import {Web3Inch} from "../SvgIcons/Web3Inch.jsx";
import {observer} from "mobx-react-lite";
import {ROUTES, ROUTE_URLS} from "../../Pages/routes.jsx";
import {eventsStore} from "@/stores/events.js";
import {uiStore} from "@stores/ui.js";
import {animationStore} from "@stores/animation.js";
import {loggerStore as logger} from "@stores/logger.js";
import {useEffect} from "react";
import {useAnimation, motion} from "framer-motion";
import {LogJSON} from "@components/logger/LogJSON.jsx";

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
        hidden: {x: -350},
        visible: {x: 0},
    };



    return (
        <motion.div
            variants={navbarVariants}
            initial="hidden"
            animate={controls}
            transition={{duration: .5, ease: "easeInOut"}}
        >
            <AppShell.Navbar
                className={classes.navbar}
                p="md"   
                width={{base: 300}}
            >
                <Center width={300}>
                    <Web3Inch color1="yellow" color2="red"/>
                </Center>

                {/* <LogJSON label="ROUTES" json={ROUTES}></LogJSON> */}
                {/* { Object.entries(ROUTE_URLS).map(([key, path])  => (
                    logger.logWhiteRandom(key,path)
                ))} */}
                {/*<MantineLink>*/}
                {/*     className={classes.link}*/}
                {/*     leftSection={route.icon}*/}
                {/*     component={Link} импортируйте Link из react-router-dom*/}
                {/*     to={path}*/}
                {/*     key={route.title}*/}
                {/*     label={route.title}*/}
                {/* </MantineLink>*/}

                {/*{eventsStore.eventsList.map((event) => (*/}
                {/*  <Accordion*/}
                {/*    variant="separated"*/}
                {/*    key={event.timestamp}*/}
                {/*    w={300}*/}
                {/*    mx="auto"*/}
                {/*  >*/}
                {/*    <Accordion.Item*/}
                {/*        key={event.data?.event}*/}
                {/*      className={classes.accordionItem}*/}
                {/*      value={event.data?.event}*/}
                {/*    >*/}
                {/*      <Accordion.Control>*/}
                {/*        {new Date(event.timestamp).toLocaleString() +*/}
                {/*          " " +*/}
                {/*          event.data?.event}*/}
                {/*      </Accordion.Control>*/}
                {/*      <Accordion.Panel>*/}
                {/*        <LogJSON*/}
                {/*          label={event.data?.event}*/}
                {/*          json={event?.data?.properties}*/}
                {/*          fontSize={10}*/}
                {/*        />*/}
                {/*      </Accordion.Panel>*/}
          {/*        </Accordion.Item>*/}
          {/*</Accordion>*/}
      </AppShell.Navbar>
      </motion.div>
  );
});
