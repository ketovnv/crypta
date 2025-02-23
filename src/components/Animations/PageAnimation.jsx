import { motion, AnimatePresence } from "framer-motion";

export const PageAnimation = ({ children }) => {

  const animations = {
    initial: { opacity: 0, y: 1000 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -1000 },
  }

  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 1 }}
    >
      <AnimatePresence exitBeforeEnter>{children}</AnimatePresence>
    </motion.div>
  );
};
