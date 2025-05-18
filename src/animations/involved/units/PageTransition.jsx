import { observer } from "mobx-react-lite";
import { router } from "@stores/router";
import { Suspense } from "react";
import { animated } from "@react-spring/web";
import { AnimatePresence, motion } from "motion/react";
import { uiStore } from "@stores/ui.js";
import { GlowingEffect } from "@animations/involved/units/GlowingEffect.jsx";
// import { logger } from "@stores/logger.js";

const AsyncPage = ({ page }) => {
  const PageComponent = router.getPageComponent(page);
  return (
    <main className="pageWrapper">
      <animated.div
        className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 pageCard"
        style={{ ...uiStore.themeStyle }}
      >
        <GlowingEffect
          blur={0}
          borderWidth={5}
          spread={120}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.1}
        />
        <Suspense fallback={<div>''</div>}>
          <PageComponent />
        </Suspense>
      </animated.div>
    </main>
  );
};

// const AsyncPage = loadable(
//   (props) =>
//     import(
//       `../../../components/pages/${props.page}`
//     ),
//   {
//     cacheKey: (props) => props.page,
//   },
// );

// logger.logWhiteRandom("📺", " Компонент PageTransition", 12);

export const PageTransition = observer(() => {
  const variants = {
    hidden: {
      opacity: 0,
      height: 0,
      rotateX: -225,
      y: 600,
      scale: 0.5,
      // transition: {delay: 0.75},
    },
    visible: {
      height: 500,
      opacity: 1,
      rotateX: 0,
      y: 0,
      scale: router.getPageSize(router.getCurrentPage),
    },
    exit: {
      height: 0,
      opacity: -0.5,
      rotateX: -200,
      y: 600,
      scale: 0.5,
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        layout
        key={router.getCurrentPage}
        // layoutId="container"
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 575,
        }}
        transition={{
          delay: 0.1,
          type: "spring",
          stiffness: 200,
          damping: 100,
          mass: 5,
          friction: 20,
          visible: { delay: 0.1 },
        }}
      >
        {/*<main>*/}
        {/*  <div style={{ color: "oklch(0.71 0.2086 263.9" }}>🏩 Hello Page!</div>*/}
        {/*</main>*/}
        <AsyncPage page={router.getCurrentPage} key={router.getCurrentPage} />
      </motion.div>
    </AnimatePresence>
  );
});
