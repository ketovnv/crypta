import React, { useEffect } from "react";
import classes from "./MainNavbar.module.css";
import { observer } from "mobx-react-lite";
import { motion } from "motion/react";
import {
  IoApertureSharp,
  IoFileTrayFullSharp,
  IoLogoReact,
  IoSettings,
  IoWallet,
} from "react-icons/io5";
import { animation } from "@stores/animation.js";
import { router } from "@stores/router.js";
import { AwesomeButton } from "@animations/current/AwesomeButton/AwesomeButton";
import { Web3Inch } from "@components/Layout/SvgIcons/Web3Inch";
import GradientText from "@animations/involved/GradientText";
import { uiStore } from "@stores/ui.js";

export const MainNavbar = observer(() => {
  const icons = {
    Home: <IoWallet size={30} />,
    Balance: <IoApertureSharp size={30} />,
    Approve: <IoLogoReact size={30} />,
    Transactions: <IoFileTrayFullSharp size={32} />,
    Options: <IoSettings size={30} />,
  };

  useEffect(() => {
    const navBarMoving = animation.getMCAnimation("NavBarMoving");
    navBarMoving.control.start("visible");
  }, []);

  return (
    <motion.nav
      // layout="position"
      animate={animation.getMCAnimation("NavBarMoving").control}
      variants={{
        hidden: {
          // opacity: 0,
          transition: {
            type: "tween",
            staggerChildren: 0.2,
            staggerDirection: -1,
          },
        },
        visible: {
          // opacity: 1,
          transition: {
            type: "tween",
            staggerChildren: 0.3,
            staggerDirection: 1,
          },
        },
      }}
      className={classes.navbar}
      initial="hidden"
    >
      <Web3Inch
        variants={{
          hidden: {
            x: -450,
            // rotateZ: -180,
            y: -200,
            scale: 0.1,
            rotateY: -360,
            filter: "blur(10px)",
            opacity: 0.9,
            transition: {
              type: "tween",
              duration: 1,
              ease: "easeInOut",
            },
          },
          visible: {
            x: 0,
            y: 60,
            // rotateZ:
            scale: 1,
            rotateY: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
              type: "tween",
              duration: 1,
              ease: "easeInOut",
            },
          },
        }}
        color1="#fff50d"
        color2="#ffc317"
        isDark={uiStore.themeIsDark}
      />
      {/*<ChromaInterpolationExample />*/}
      {/*<FixedImperativeLoopAnimation />*/}
      {router.getPages.map(([path, name]) => {
        const isActive = path === router.getCurrentPage;
        // logger.info('path', path + ' ' + JSON.stringify(active))
        return (
          <AwesomeButton
            background={animation.theme.navBarButtonBackground}
            variants={{
              hidden: {
                x: -450,
                // rotateZ: -180,
                y: 100,
                rotateY: -360,
                transition: {
                  type: "tween",
                  duration: 0.5,
                  ease: "easeInOut",
                },
              },
              visible: {
                x: 0,
                y: 60,
                // rotateZ: 0,
                rotateY: 0,
                opacity: 1,
                transition: {
                  type: "tween",
                  duration: 1,
                  ease: "easeInOut",
                },
              },
            }}
            style={{
              padding: 2,
              width: 295,
            }}
            animate={{
              scale: !isActive ? 1 : 0.99,
              color: isActive ? "#FFFF55" : "#1050CC",
            }}
            isActive={isActive}
            onPress={() => router.goTo(path)}
            whileTap={{ scale: 0.99 }}
            whileHover={{ scale: isActive ? 0.99 : 1.01 }}
            type="mainNavBar"
            before={icons[path]}
            buttonKey={path}
            key={path}
          >
            <GradientText
              isActive={isActive}
              showBorder={false}
              className="custom-class"
            >
              {name}
            </GradientText>
          </AwesomeButton>
        );
      })}
    </motion.nav>
  );
});

console.log(`[MainNavbar.jsx] :☎️`);
