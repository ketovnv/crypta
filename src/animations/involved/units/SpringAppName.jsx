import { animation } from "@stores/animation";
import { uiStore as ui } from "@stores/ui.js";
import { motion } from "motion/react";
import { logger } from "@stores/logger.js";
import { observer } from "mobx-react-lite";
import { animated, useTrail } from "@react-spring/web";

export const SpringAppName = observer(() => {
  logger.logRandomColors("SpringApp", "Render!!!", 32);

  const appNameArray = [
    ...animation.getAppNameArray,
    // '_',
    // ...JSON.stringify(ui.themeIsDark).split('')
  ];

  const trail = useTrail(appNameArray.length, {
    x: !animation.getAppNameIsHover ? 0 : -25,
    opacity: !animation.getAppNameIsHover ? 0.85 : 1,
    color: logger.getRandomColor(ui.themeIsDark ? 16 : 6),
  });

  return (
    <motion.div
      layout
      style={{
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0,
        position: "relative",
        fontSize: "2.5rem",
        fontWeight: 900,
        fontFamily: "Tactic Round Bld, monospace",
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1, transition: { duration: 3 } }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 3 },
      }}
      whileTap={{ scale: 0.96 }}
      onHoverStart={() => animation.setAppNameIsHover(true)}
      onHoverEnd={() => animation.setAppNameIsHover(false)}
    >
      {trail.map(({ x, ...rest }, index) => (
        <animated.div
          key={x + index}
          style={{
            ...rest,
            transform: x.to((x) => `translate3d(0,${x / 3}px,0)`),
          }}
        >
          {appNameArray[index]}
        </animated.div>
      ))}
    </motion.div>
  );
});
