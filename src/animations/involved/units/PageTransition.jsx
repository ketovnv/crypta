import { observer } from "mobx-react-lite";
import { router } from "@stores/router";
import { Suspense } from "react";
import { animated } from "@react-spring/web";
import { AnimatePresence, motion } from "motion/react";
import { uiStore } from "@stores/ui.js";
import { core } from "@stores/core";
import { GlowingEffect } from "@animations/involved/units/GlowingEffect.jsx";
import { logger } from "@stores/logger.js";
import params from "@animations/configs/pageTransition.json";
import { LJ } from "@components/logger/LJ.jsx";
import PerformanceMonitor from "@components/logger/PerformanceMonitor.js";
import LoggerTest from "@components/LoggerTest.jsx";

const AsyncPage = () => {
  return (
    <Suspense>
      <GlowingEffect
        blur={0}
        borderWidth={3}
        spread={120}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.1}
      >
        <router.getCurrentPageComponent />
      </GlowingEffect>
    </Suspense>
  );
};

export const PageTransition = observer(() => {
  // logger.logWhiteRandom("📺", " Компонент PageTransition", 12);

  return (
    <AnimatePresence>
      <motion.div
        animate={{ right: 75 }}
        transition={params.transition}
        style={{
          color: "oklch(0.71 0.2086 263.9",
          fontSize: 50,
          position: "absolute",
          right: 750,
          top: 75,
        }}
      >
        <motion.div
          layout
          key={router.getCurrentPage}
          variants={{
            hidden: params.hidden,
            visible: {
              ...params.visible,
              scale: 1,
              scaleY: 1, // scale: router.getCurrentPageComponent[1][0],
              // scaleY: 1 / router.getCurrentPageComponent[1][1],
            },
            exit: params.exit,
          }}
          style={params.style}
          transition={params.transition}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <AsyncPage key={router.getCurrentPage} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});
