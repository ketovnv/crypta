import { Group, useMantineColorScheme } from "@mantine/core";
import { FiMoon, FiSun } from "react-icons/fi";
import { observer } from "mobx-react-lite";
import { animated, config, useSpring } from "@react-spring/web";
import { uiStore } from "@stores/ui";
import { animationStore } from "@stores/animation.js";

const SliderToggle = ({ setSelected }) => {
  const isDark = uiStore.themeIsDark;

  const sliderAnimation = useSpring({
    x: isDark ? "0%" : "80%",
    config: {
      mass: 1.7,
      tension: 300,
      friction: 120,
      clamp: false,
      precision: 0.01,
    },
  });

  const darkIconAnimation = useSpring({
    scale: isDark ? 0.75 : 1.3,
    rotateZ: isDark ? -180 : -0,
    opacity: isDark ? 0 : 1,
    color: !isDark ? "#000" : "#777",
    stroke: !isDark ? "#000" : "#777",
    filter: !isDark
      ? "drop-shadow(0 1px 1px rgba(0, 0, 0, 1))"
      : "drop-shadow(0 0 0 rgba(255, 196, 0, 0))",
    config: { ...config.molasses, stiffness: 300, damping: 20 },
  });
  const lightIconAnimation = useSpring({
    scale: !isDark ? 0.65 : 1.2,
    rotateZ: !isDark ? -180 : 0,
    opacity: !isDark ? 0 : 1,
    color: isDark ? "#FFC" : "#333",
    filter: isDark
      ? "drop-shadow(0 0 0 rgba(255, 196, 0, 0))"
      : "drop-shadow(0 0 30px rgba(255, 196, 0, 1))",
    config: { ...config.molasses, stiffness: 300, damping: 20 },
    onRest: async (result, ctrl, item) => {
      const animationConfig = { duration: 500 };
      if (uiStore.themeIsDark) {
        await ctrl.start({
          filter: "drop-shadow(0 0 3px rgba(255, 196, 0, 1))",
        });
        await new Promise((resolve) => setTimeout(resolve, 300));
        await ctrl.start(
          {
            filter: "drop-shadow(0 0 5px rgba(255, 196, 100, 0.5))",
          },
          animationConfig,
        );
        await new Promise((resolve) => setTimeout(resolve, 300));
        await ctrl.start(
          {
            filter: "drop-shadow(0 0 2px rgba(255, 196, 100, 0.3))",
          },
          animationConfig,
        );
        await new Promise((resolve) => setTimeout(resolve, 500));
        await ctrl.start(
          { filter: "drop-shadow(0 0 0 rgba(255, 196, 0, 0))" },
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

  return (
    <Group
      style={{
        position: "relative",
        left: 35,
        width: "220px",
        height: "57px",
        borderRadius: "28px",
        overflow: "hidden",
        padding: "3px",
      }}
      spacing={0}
    >
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          position: "relative",
          zIndex: 10,
          width: "50%",
          height: "100%",
          justifyContent: "center",
          border: "none",
          background: "none",
          cursor: "pointer",
          outline: "none",
        }}
        onClick={() => setSelected("light")}
      >
        <animated.div style={lightIconAnimation}>
          <FiSun style={{ fontSize: "2.2em" }} />
        </animated.div>
      </button>

      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          position: "relative",
          left: -22,
          zIndex: 10,
          width: 55,
          height: 55,
          justifyContent: "center",
          border: "none",
          background: "none",
          cursor: "pointer",
          outline: "none",
        }}
        onClick={() => setSelected("dark")}
      >
        <animated.div style={darkIconAnimation}>
          <FiMoon style={{ fontSize: "2.2em" }} />
        </animated.div>
      </button>

      <animated.div
        style={{
          position: "absolute",
          left: "6px",
          top: "-2px",
          height: "100%",
          width: "45%",
          borderRadius: "25px",
          zIndex: 1,
          background:
            "linear-gradient(135deg, #5356C1 0%, #4f46e5 50%, #4338ca 100%)",
          boxShadow: "0 2px 8px rgba(79, 70, 229, 0.5)",
          transform: sliderAnimation.x.to((x) => `translateX(${x})`),
        }}
      />
    </Group>
  );
};

const ThemeToggle = observer(() => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  console.log(
    "%c 1 --> Line: 148||ThemeToggle.jsx\n colorScheme: ",
    "color:#f0f;",
    colorScheme,
  );
  console.log(
    "%c 5 --> Line: 148||ThemeToggle.jsx\n uiStore.colorScheme: ",
    "color:#0ff;",
    uiStore.colorScheme,
  );

  const containerAnimation = useSpring({
    config: {
      duration: 300,
    },
  });

  return (
    <animated.div
      style={{
        ...containerAnimation,
        display: "grid",
        placeContent: "center",
      }}
    >
      <SliderToggle
        selected={colorScheme}
        setSelected={() => {
          animationStore.toggleTheme();
          animationStore.changeOptionsTransitionsTestState();
          toggleColorScheme();
          uiStore.toggleColorScheme();
        }}
      />
    </animated.div>
  );
});

export default ThemeToggle;
