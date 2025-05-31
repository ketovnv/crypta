// import { animations } from "@stores/animations";
import { uiStore as ui } from "@stores/ui.js";
import { motion } from "motion/react";
import { logger } from "@stores/logger.js";
import { observer } from "mobx-react-lite";
import { animated, useTrail } from "@react-spring/web";

export const SpringAppName = observer(() => {
  // logger.logRandomColors("SpringApp", "Render!!!", 32);

  const appNameArray = [...ui.getAppNameArray];

  const trail = useTrail(appNameArray.length, {
    x: !ui.getAppNameIsHover ? 0 : -25,
    opacity: !ui.getAppNameIsHover ? 0.85 : 1,
    color: logger.getRandomColor(ui.themeIsDark ? 16 : 6),
  });

  return (
    <motion.div
      style={{
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0,
        position: "relative",
        fontSize: "2rem",
        fontWeight: 900,
        fontFamily: "Tactic Round Blk, monospace",
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1, transition: { duration: 3 } }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 3 },
      }}
      whileTap={{ scale: 0.96 }}
      onHoverStart={() => ui.setAppNameIsHover(true)}
      onHoverEnd={() => ui.setAppNameIsHover(false)}
    >
      {trail.map(({ x, ...rest }, index) => (
        <animated.div
          key={x + index}
          style={{
            ...rest,
            transform: x.to((x) => `translate3d(0,${x / 3}px,${x / 5}px)`),
          }}
        >
          {appNameArray[index]}
        </animated.div>
      ))}
    </motion.div>
  );
});
