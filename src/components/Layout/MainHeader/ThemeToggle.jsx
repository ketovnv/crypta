import classes from "./MainHeader.module.css";
import { animated, config, useSpring } from "@react-spring/web";
import { FiMoon, FiSun } from "react-icons/fi";
import { gradientStore } from "@stores/gradient.js";
import { consoleGradient } from "@components/logger/ConsoleGradient.js";
import { logger } from "@stores/logger.js";
import { observer } from "mobx-react-lite";
import { uiStore } from "@stores/ui.js";

const ThemeToggle = observer(() => {
  const sliderAnimation = useSpring({
    rotateZ: uiStore.themeIsDark ? 0 : 100,
    right: uiStore.themeIsDark ? 3 : 15,
    top: 50,
    config: {
      mass: 20,
      tension: 300,
      friction: 20,
      damping: 20,
    },
  });
  const lightIconAnimation = useSpring({
    scale: uiStore.themeIsDark ? 0.2 : 1.2,
    rotateZ: uiStore.themeIsDark ? -360 : 0,
    opacity: uiStore.themeIsDark ? -0.5 : 1,
    color: !uiStore.themeIsDark ? "oklch(0.9 0.175 75.54)" : "oklch(0.32 0 0)",
    filter: uiStore.themeIsDark
      ? "drop-shadow(0 0 0 rgba(255, 196, 0, 0))"
      : "drop-shadow(0 10px 30px rgba(255, 196, 0, 1))",
    config: { ...config.molasses, stiffness: 300, damping: 20 },
    // onRest: async (result, ctrl, item) => {
    //   const animationConfig = { duration: 500 };
    //   if (!uiStore.themeIsDark) {
    //     await ctrl.start({
    //       filter: "drop-shadow(0 0 3px rgba(255, 196, 0, 1))",
    //     });
    //     await new Promise((resolve) => setTimeout(resolve, 300));
    //     await ctrl.start(
    //       {
    //         filter: "drop-shadow(0 0 5px rgba(255, 196, 100, 0.7))",
    //       },
    //       animationConfig,
    //     );
    //     await new Promise((resolve) => setTimeout(resolve, 300));
    //     await ctrl.start(
    //       {
    //         filter: "drop-shadow(0 0 2px rgba(255, 196, 100, 0.5))",
    //       },
    //       animationConfig,
    //     );
    //     await new Promise((resolve) => setTimeout(resolve, 500));
    //     logger.debug("ThemeToggle", "start3");
    //     await ctrl.start(
    //       { filter: "drop-shadow(0 0 0 rgba(255, 196, 0, 0.3))" },
    //       animationConfig,
    //     );
    //     logger.debug("ThemeToggle", "start4");
    //   } else {
    //     logger.debug("ThemeToggle", "star5");
    //     await ctrl.start({
    //       opacity: 0,
    //       scale: 0.1,
    //       filter: "drop-shadow(0 0 0 rgba(255, 196, 0, 0))",
    //     });
    //     logger.debug("ThemeToggle", "star6");
    //   }
    // },
  });

  logger.debug("ThemeToggle", "star7");
  // const darkIconAnimation = useSpring({
  //   scale: !uiStore.themeIsDark ? 0 : 1.3,
  //   rotateZ: !uiStore.themeIsDark ? 360 : -0,
  //   opacity: !uiStore.themeIsDark ? -0.5 : 1,
  //   color: uiStore.themeIsDark ? "oklch(0.5 0 0)" : "oklch(0.1 0 0)",
  //   stroke: uiStore.themeIsDark ? "oklch(0.5 0 0)" : "oklch(0.1 0 0)",
  //   filter: uiStore.themeIsDark
  //     ? "drop-shadow(0 1px 1px rgba(0, 0, 0, 1))"
  //     : "drop-shadow(0 0 0 rgba(255, 196, 0, 0))",
  //   config: { ...config.molasses, stiffness: 300, damping: 20 },
  // });

  logger.debug("ThemeToggle", "star8");
  return (
    <FiSun style={{ fontSize: "2em" }} />
    // <animated.button
    //   onClick={(event) => uiStore.setColorScheme(uiStore.themeIsDark ? "light" : "dark")}
    //   className={classes.toggleThemeWrapper}
    //   style={sliderAnimation}
    //   spacing={0}
    // >
    //   {/*<Button onClick={(event) => uiStore.setColorScheme(uiStore.themeIsDark ? "light" : "dark")}>*/}
    //   {/*  Theme*/}
    //   {/*</Button>*/}
    //   <span className={classes.lightThemeButton}>
    //     <animated.div style={lightIconAnimation}>
    //       <FiSun style={{ fontSize: "2em" }} />
    //     </animated.div>
    //   </span>
    //   <span className={classes.darkThemeButton}>
    //     <animated.div style={darkIconAnimation}>
    //       <FiMoon style={{ fontSize: "2em" }} />
    //     </animated.div>
    //   </span>
    // </animated.button>
  );
});

export default ThemeToggle;
