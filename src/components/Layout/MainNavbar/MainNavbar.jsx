import { AppShell, Center, Text } from "@mantine/core";
import classes from "./MainNavbar.module.css";
import { Web3Inch } from "../SvgIcons/Web3Inch.jsx";
import { observer } from "mobx-react-lite";
import { uiStore } from "@stores/ui.js";
import { animationStore } from "@stores/animation.js";
import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import { AwesomeButton } from "@animations/involved/AwesomeButton";
import GradientText from "@animations/involved/GradientText";
import { router } from "@stores/router";
import {
  IoApertureSharp,
  IoFileTrayFullSharp,
  IoLogoReact,
  IoSettings,
  IoWallet,
} from "react-icons/io5";

export const MainNavbar = observer(() => {
  const icons = {
    Home: <IoWallet size={30} />,
    Balance: <IoApertureSharp size={30} />,
    Approve: <IoLogoReact size={30} />,
    Transactions: <IoFileTrayFullSharp size={32} />,
    Options: <IoSettings size={30} />,
  };

  const controls = useAnimation();

  useEffect(() => {
    if (uiStore.isNavbarOpened) {
      controls.start("visible");
      animationStore.setNavbarX(0);
    } else {
      controls.start("hidden");
      animationStore.setNavbarX(-385);
    }
  }, [uiStore.isNavbarOpened]);

  const navbarVariants = {
    hidden: { x: -385, opacity: 0.2 },
    visible: { x: 0, opacity: 1 },
  };
  return (
    <motion.div
      variants={navbarVariants}
      initial="hidden"
      animate={controls}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      <AppShell.Navbar
        // style={{ position: "absolute", top: 60, left: 0 }}
        className={classes.navbar}
        p="md"
        width={{ base: 300 }}
      >
        <Text>{JSON.stringify(uiStore.themeIsDark)}</Text>
        <Center>
          <Web3Inch
            color1="yellow"
            color2="orange"
            isDark={uiStore.themeIsDark}
          />
        </Center>

        {router.getPages().map(([path, route]) => {
          const active = route.element === router.getPageElement;
          return (
            <AwesomeButton
              style={{
                scale: active ? 1 : 0.95,
                color: active ? "blue" : "white",
                padding: 3,
              }}
              active={active}
              onPress={() => router.goTo(path)}
              whileTap={{ scale: 0.95 }}
              type="instagram"
              before={icons[route.element]}
              buttonKey={path}
              key={path}
            >
              <GradientText
                animationSpeed={active ? 20 : 3}
                showBorder={false}
                className="custom-class"
              >
                {route.title}
              </GradientText>
            </AwesomeButton>
          );
        })}
      </AppShell.Navbar>
    </motion.div>
  );
});
