import { observer } from "mobx-react-lite";
import { router } from "@stores/router";
import loadable from "@loadable/component";
import { AnimatePresence, motion } from "motion/react";
// import { logger } from "@stores/logger.js";

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

// logger.logWhiteRandom("📺", " Компонент PageTransition", 12);

export const PageTransition = observer(() => {
  const variants = {
    hidden: {
      opacity: 0,
      height: 0,
      rotateX: -225,
      y:450,
      // transition: {delay: 0.75},
    },
    visible: {
      height: 500,
      opacity: 1,
      rotateX: 0,
      y:0,
    },
    exit: {
      height: 0,
      opacity: -0.5,
      rotateX: -200,
      y: 450,
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
          visible:{delay: 0.1},
        }}
      >
        <AsyncPage page={router.getCurrentPage} />
      </motion.div>
    </AnimatePresence>
  );
});
