import classes from "./MainHeader.module.css";
import { Button } from "@mantine/core";
import { animated } from "@react-spring/web";

const ThemeToggle = ({ isDark, setColorScheme }) => {
  //
  // const sliderAnimation = useSpring({
  //     shadowY: isDark ? 4 : 8,
  //     shadowX: isDark ? 8 : 4,
  //     rotateX: 360,
  //     shadowColor: isDark
  //         ? 'rgba(0 , 0, 0, 1)'
  //         : 'rgba(255, 255, 150, 1)',
  //     config: {
  //         mass: 1.7,
  //         tension: 300,
  //         friction: 120
  //
  //     },
  // });
  //
  //
  // const lightIconAnimation = useSpring({
  //     scale: isDark ? 0.65 : 1.2,
  //     rotateZ: isDark ? -180 : 0,
  //     opacity: isDark ? 0 : 1,
  //     color: !isDark ? "#FFC" : "#333",
  //     filter: isDark
  //         ? "drop-shadow(0 0 0 rgba(255, 196, 0, 0))"
  //         : "drop-shadow(0 0 30px rgba(255, 196, 0, 1))",
  //     config: {...config.molasses, stiffness: 300, damping: 20},
  //     onRest: async (result, ctrl, item) => {
  //         const animationConfig = {duration: 500};
  //         if (!isDark) {
  //             await ctrl.start({
  //                 filter: "drop-shadow(0 0 3px rgba(255, 196, 0, 1))",
  //             });
  //             await new Promise((resolve) => setTimeout(resolve, 300));
  //             await ctrl.start(
  //                 {
  //                     filter: "drop-shadow(0 0 5px rgba(255, 196, 100, 0.5))",
  //                 },
  //                 animationConfig,
  //             );
  //             await new Promise((resolve) => setTimeout(resolve, 300));
  //             await ctrl.start(
  //                 {
  //                     filter: "drop-shadow(0 0 2px rgba(255, 196, 100, 0.3))",
  //                 },
  //                 animationConfig,
  //             );
  //             await new Promise((resolve) => setTimeout(resolve, 500));
  //             await ctrl.start(
  //                 {filter: "drop-shadow(0 0 0 rgba(255, 196, 0, 0))"},
  //                 animationConfig,
  //             );
  //         } else {
  //             await ctrl.start({
  //                 opacity: 0,
  //                 scale: 0.1,
  //                 filter: "drop-shadow(0 0 0 rgba(255, 196, 0, 0))",
  //             });
  //         }
  //     },
  // });
  //
  // const darkIconAnimation = useSpring({
  //     scale: !isDark ? 0.75 : 1.3, rotateZ: !isDark ? -180 : -0,
  //     opacity: !isDark ? 0 : 1,
  //     color: isDark ? "#000" : "#777",
  //     stroke: isDark ? "#000" : "#777",
  //     filter: isDark
  //         ? "drop-shadow(0 1px 1px rgba(0, 0, 0, 1))"
  //         : "drop-shadow(0 0 0 rgba(255, 196, 0, 0))",
  //     config: {...config.molasses, stiffness: 300, damping: 20},
  // });
  //
  return (
    <animated.div
      className={classes.toggleThemeWrapper}
      style={{
        // position: "absolute",
        left: "6px",
        top: "-2px",
        height: "100%",
        width: "45%",
        borderRadius: "25px",
        zIndex: 10,
        // background: 'rgba(0, 0, 0, 1)',
        background: "135deg, #5356C1 0%, #4f46e5 50%, #4338ca 100%)",
        // boxShadow: sliderAnimation.background.to()`0 2px 8px '${shadowColor}'`,
        // transform: sliderAnimation.background.to((???) => ,???
        //  boxShadow: `0 2px 8px '${sliderAnimation.shadowColor}`,
      }}
      spacing={0}
    >
      <Button onClick={(event) => setColorScheme(isDark ? "light" : "dark")}>
        Theme
      </Button>
      {/*<button*/}
      {/*  className={classes.lightThemeButton}*/}
      {/*  onClick={() => setColorScheme("light")}*/}
      {/*>*/}
      {/*  <animated.div style={lightIconAnimation}>*/}
      {/*    <FiSun style={{ fontSize: "2.2em" }} />*/}
      {/*  </animated.div>*/}
      {/*</button>*/}
      {/*<button*/}
      {/*  className={classes.darkThemeButton}*/}
      {/*  onClick={() => setColorScheme("dark")}*/}
      {/*>*/}
      {/*  <animated.div style={darkIconAnimation}>*/}
      {/*    <FiMoon style={{ fontSize: "2.2em" }} />*/}
      {/*  </animated.div>*/}
      {/*</button>*/}
    </animated.div>
  );
};

export default ThemeToggle;
