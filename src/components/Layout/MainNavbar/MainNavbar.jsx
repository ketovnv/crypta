import {AppShell, Center} from "@mantine/core";
import classes from "./MainNavbar.module.css";
import {Web3Inch} from "../SvgIcons/Web3Inch.jsx";
import {observer} from "mobx-react-lite";
import {uiStore} from "@stores/ui.js";
import {animationStore} from "@stores/animation.js";
import {useEffect} from "react";
import {motion, useAnimation} from "framer-motion";

import {AwesomeButton} from "@animations/involved/AwesomeButton";
import GradientText from "@animations/involved/GradientText";
import {routerStore} from "@stores/router.js";
import {
  IoApertureSharp,
  IoArrowForwardSharp,
  IoFileTrayFullSharp,
  IoLogoReact,
  IoSettings,
  IoWallet
} from "react-icons/io5";

export const MainNavbar = observer(() => {

  const icons = {
    Home: <IoWallet color="#000 !important" size={24}/>,
    Balance: <IoApertureSharp size={24}/>,
    Approve: <IoLogoReact size={24}/>,
    Transactions: <IoFileTrayFullSharp size={24}/>,
    Options: <IoSettings size={24}/>,
  };
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
    hidden: {x: -350, opacity: .5},
    visible: {x: 0, opacity: 1},
  };

  return (
      <motion.div
          variants={navbarVariants}
          initial="hidden"
          animate={controls}
          transition={{duration: 0.5, ease: "easeInOut"}}
      >
        <AppShell.Navbar className={classes.navbar} p="md" width={{base: 300}}>
          <Center>
            <Web3Inch color1="yellow" color2="red"/>
          </Center>

          {routerStore.getPages().map(([path, route]) => (
              <Center p={3} key={path}>
                <AwesomeButton
                    onClick={() => alert('')}
                    type="instagram"
                    before={icons[route.element]}
                    after={<IoArrowForwardSharp pr={3} size={20}/>}
                >
                  <GradientText
                      animationSpeed={3}
                      showBorder={false}
                      className="custom-class"
                  >
                    {route.title}
                  </GradientText>
                </AwesomeButton>
              </Center>
          ))}
      </AppShell.Navbar>
      </motion.div>
  );
});
