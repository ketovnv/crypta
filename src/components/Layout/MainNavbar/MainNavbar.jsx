import React, { useEffect } from "react";
import classes from "./MainNavbar.module.css";
import { observer } from "mobx-react-lite";
import { LayoutGroup, motion } from "motion/react";
import {
  IoApertureSharp,
  IoLogoReact,
  IoSettings,
  IoWallet,
} from "react-icons/io5";
import { router } from "@stores/router.js";
import { AwesomeButton } from "@animations/current/AwesomeButton/AwesomeButton";
import { Web3Inch } from "@components/Layout/SvgIcons/Web3Inch";
import GradientText from "@animations/involved/GradientText";
import { uiStore } from "@stores/ui.js";
import { Etherium } from "@components/Layout/SvgIcons/Etherium.jsx";
import { LJ } from "@components/logger/LJ.jsx";
import { gradientStore } from "@stores/gradient.js";

export const MainNavbar = observer(() => {
  const icons = {
    Transactions: (
      <Etherium
        width={20}
        initial={{ x: -2 }}
        animate={{ x: 12 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        style={{ marginRight: 10 }}
      />
    ),
    Home: <IoWallet size={34} />,
    Approve: <IoLogoReact size={34} />,
    Balance: <IoApertureSharp size={34} />,
    Options: <IoSettings size={34} />,
  };

  useEffect(() => {
    // const navBarMoving = animation.getMCAnimation("NavBarMoving");
    // navBarMoving.control.start("visible");
  }, []);

  return (
    <motion.nav
      layout
      // animate={animation.getMCAnimation("NavBarMoving").control}
      // variants={animation.getMCAnimation("NavBarMoving").frameVariants}
      className={classes.navbar}
      // initial="hidden"
      // initial="hidden"
      // initial="hidden"
      initial="visible"
    >
      <LayoutGroup path={router.getCurrentPage} layout>
        <Web3Inch
          variants={{
            hidden: {
              x: -450,
              // rotateZ: -180,
              y: -200,
              scale: 0.1,
              rotateY: -100,
              rotateZ: -100,
              rotate: 760,
              opacity: 0.5,
              transition: {
                type: "spring",
                visualDuration: 1,
                bounce: 0.5,
              },
            },
            visible: {
              x: 0,
              y: 35,
              rotate: 0,
              rotateZ: 0,
              scale: 1,
              rotateY: 0,
              opacity: 1,
              transition: {
                type: "spring",
                visualDuration: 1,
                bounce: 0.55,
              },
            },
          }}
          isDark={uiStore.themeIsDark}
        />
        {/*<div*/}
        {/*  style={{*/}
        {/*    width: 300,*/}
        {/*    height: 400,*/}
        {/*    background: "blue",*/}
        {/*    color: "yellow",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <span>{JSON.stringify(gradientStore.getTheme)} </span>*/}
        {/*</div>*/}
        {router.getPages.map(([path, name]) => {
          const isActive = path === router.getCurrentPage;
          // logger.info('path', path + ' ' + JSON.stringify(isActive))
          return (
            <AwesomeButton
              background={uiStore.theme.navBarButtonBackground}
              // variants={animation.getMCAnimation("NavBarMoving").variants}
              style={{
                marginTop: 0,
                padding: 2,
                width: 275,
                height: 64,
              }}
              animate={{
                scale: !isActive ? 1 : 0.99,
                color: isActive
                  ? uiStore.themeIsDark
                    ? "hsl(59.77 94% 75.99%)"
                    : "hsl(34.94 100% 49%)"
                  : uiStore.themeIsDark
                    ? "hsl(217.9 100% 66%)"
                    : "hsl(219.64 87% 33%)",
              }}
              isActive={isActive}
              onPress={() => router.goTo(path)}
              whileTap={{ scale: 0.99 }}
              // whileHover={{ scale: isActive ? 0.99 : 1.01 }}
              type="mainNavBar"
              before={icons[path]}
              buttonKey={path}
              key={path}
            >
              <GradientText
                fontFamily="Nunito, sans-serif"
                fontWeight={isActive ? 950 : 700}
                colors={
                  isActive
                    ? uiStore.theme.navBarActiveButtonText
                    : uiStore.theme.navBarButtonText
                }
                fontSize={30}
              >
                {name}
              </GradientText>
            </AwesomeButton>
          );
        })}
      </LayoutGroup>
    </motion.nav>
  );
});
