// import { motion } from "motion/react";
// import { animation } from "@stores/animation";
// import { useLayoutEffect } from "react";
//
// export const PageAnimation = ({ children }) => {
//   const { setCurrentAnimation, clearCurrentAnimation } = animation;
//
//   useLayoutEffect(() => {
//     if (!animation.currentAnimation) return;
//     setCurrentAnimation("pageTransition");
//     // Анімація переходу сторінки
//     setTimeout(() => {
//       clearCurrentAnimation();
//     }, 500);
//   }, [setCurrentAnimation, clearCurrentAnimation]);
//
//   const animations = {
//     initial: { opacity: 0, y: 100 },
//     animate: { opacity: 1, y: 0 },
//   };
//
//   return (
//     <motion.div
//       variants={animations}
//       initial="initial"
//       animate="animate"
//       transition={{ duration: 0.5 }}
//     >
//       {children}
//     </motion.div>
//   );
// };
