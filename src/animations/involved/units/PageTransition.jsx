import { observer } from "mobx-react-lite";
import { router } from "@stores/router";
import loadable from "@loadable/component";
import { AnimatePresence, motion } from "motion/react";
import { logger } from "@stores/logger.js";

const AsyncPage = loadable(
  (props) =>
    import(
      /* @vite-ignore */
      `../../../components/pages/${props.page}`
    ),
  {
    cacheKey: (props) => props.page,
  },
);

logger.logWhiteRandom("📺", " Компонент PageTransition", 12);

export const PageTransition = observer(() => {
  const variants = {
    hidden: {
      opacity: 0,
      rotateX: -225,
      scale: 0.01,
      // transition: {delay: 0.75},
    },
    visible: {
      opacity: 1,
      rotateX: 0,
      scale: 1,
    },
    exit: {
      opacity: -0.5,
      rotateX: -200,
      scale: 1.5,
    },
  };

  return (
    <AnimatePresence
      style={{ width: "100%", height: "100%", perspective: 2000 }}
    >
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
        }}
      >
        <AsyncPage page={router.getCurrentPage} />
      </motion.div>
    </AnimatePresence>
  );
});
console.log(`[PageTransition.jsx] :☎️`);
