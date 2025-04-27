import classes from "./MainHeader.module.css";
import { animated, config, useSpring } from "@react-spring/web";
import { FiMoon, FiSun } from "react-icons/fi";

const ThemeToggle = ({ isDark, setColorScheme }) => {
  const sliderAnimation = useSpring({
    rotateZ: isDark ? 0 : 100,
    right: isDark ? 30 : 55,
    top: isDark ? 1 : 5,
    config: {
      mass: 10,
      tension: 200,
      friction: 20,
    },
  });

  const lightIconAnimation = useSpring({
    scale: isDark ? 0.2 : 1.2,
    rotateZ: isDark ? -360 : 0,
    opacity: isDark ? -0.5 : 1,
    color: !isDark ? "oklch(0.9 0.175 75.54)" : "oklch(0.32 0 0)",
    filter: isDark
      ? "drop-shadow(0 0 0 rgba(255, 196, 0, 0))"
      : "drop-shadow(0 10px 30px rgba(255, 196, 0, 1))",
    config: { ...config.molasses, stiffness: 300, damping: 20 },
    onRest: async (result, ctrl, item) => {
      const animationConfig = { duration: 500 };
      if (!isDark) {
        await ctrl.start({
          filter: "drop-shadow(0 0 3px rgba(255, 196, 0, 1))",
        });
        await new Promise((resolve) => setTimeout(resolve, 300));
        await ctrl.start(
          {
            filter: "drop-shadow(0 0 5px rgba(255, 196, 100, 0.7))",
          },
          animationConfig,
        );
        await new Promise((resolve) => setTimeout(resolve, 300));
        await ctrl.start(
          {
            filter: "drop-shadow(0 0 2px rgba(255, 196, 100, 0.5))",
          },
          animationConfig,
        );
        await new Promise((resolve) => setTimeout(resolve, 500));
        await ctrl.start(
          { filter: "drop-shadow(0 0 0 rgba(255, 196, 0, 0.3))" },
          animationConfig,
        );
      } else {
        await ctrl.start({
          opacity: 0,
          scale: 0.1,
          filter: "drop-shadow(0 0 0 rgba(255, 196, 0, 0))",
        });
      }
    },
  });

  const darkIconAnimation = useSpring({
    scale: !isDark ? 0 : 1.3,
    rotateZ: !isDark ? 360 : -0,
    opacity: !isDark ? -0.5 : 1,
    color: isDark ? "oklch(0.5 0 0)" : "oklch(0.1 0 0)",
    stroke: isDark ? "oklch(0.5 0 0)" : "oklch(0.1 0 0)",
    filter: isDark
      ? "drop-shadow(0 1px 1px rgba(0, 0, 0, 1))"
      : "drop-shadow(0 0 0 rgba(255, 196, 0, 0))",
    config: { ...config.molasses, stiffness: 300, damping: 20 },
  });

  return (
    <animated.button
      onClick={(event) => setColorScheme(isDark ? "light" : "dark")}
      className={classes.toggleThemeWrapper}
      style={sliderAnimation}
      spacing={0}
    >
      {/*<Button onClick={(event) => setColorScheme(isDark ? "light" : "dark")}>*/}
      {/*  Theme*/}
      {/*</Button>*/}
      <span className={classes.lightThemeButton}>
        <animated.div style={lightIconAnimation}>
          <FiSun style={{ fontSize: "2em" }} />
        </animated.div>
      </span>
      <span className={classes.darkThemeButton}>
        <animated.div style={darkIconAnimation}>
          <FiMoon style={{ fontSize: "2em" }} />
        </animated.div>
      </span>
    </animated.button>
  );
};

export default ThemeToggle;
