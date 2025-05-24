import { observer } from "mobx-react-lite";
import { router } from "@stores/router";
import { Suspense } from "react";
import { animated } from "@react-spring/web";
import { AnimatePresence, motion } from "motion/react";
import { uiStore } from "@stores/ui.js";
import { GlowingEffect } from "@animations/involved/units/GlowingEffect.jsx";
import { logger } from "@stores/logger.js";
import params from "./configs/pageTransition.json";

const AsyncPage = () => "AAA";
{
  // const LazyPage = (
  //   <Suspense fallback={<div>''</div>}>
  //     {router.getCurrentPageComponent[0]}
  //   </Suspense>
  // );
  // return router.getCurrentPageComponent[1][2] ? (
  //   <main className="pageWrapper">
  //     {/*<animated.div*/}
  //     {/*  className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 pageCard"*/}
  //     {/*  style={{ ...uiStore.themeStyle }}*/}
  //     {/*>*/}
  //     {/*  <GlowingEffect*/}
  //     {/*    blur={0}*/}
  //     {/*    borderWidth={3}*/}
  //     {/*    spread={120}*/}
  //     {/*    glow={true}*/}
  //     {/*    disabled={false}*/}
  //     {/*    proximity={64}*/}
  //     {/*    inactiveZone={0.1}*/}
  //     {/*  />*/}
  //     {/*  <Suspense fallback={<div>''</div>}>*/}
  //     {/*    {router.getCurrentPageComponent[0]}*/}
  //     {/*  </Suspense>*/}
  //     {/*</animated.div>*/}
  //   </main>
  // ) : (
  //   <Suspense fallback={<div>''</div>}>
  //     {router.getCurrentPageComponent[0]}
  //   </Suspense>
  // );
}
// const AsyncPage = loadable(
//   (props) =>sn,mmq
//     import(
//       `../../../components/pages/${props.page}`
//     ),
//   {
//     cacheKey: (props) => props.page,
//   },
// );

logger.logWhiteRandom("📺", " Компонент PageTransition", 12);

export const PageTransition = observer(() => {
  return (
    <span>123</span>
    // <AnimatePresence>
    //   <motion.div
    //     layout
    //     key={router.getCurrentPage}
    //     variants={{
    //       hidden: params.hidden,
    //       visible: {
    //         ...params.visible,
    //         scale: router.getCurrentPageComponent[1][0],
    //         scaleY: 1 / router.getCurrentPageComponent[1][1],
    //       },
    //       exit: params.exit,
    //     }}
    //     style={params.style}
    //     transition={params.transition}
    //     initial="hidden"
    //     animate="visible"
    //     exit="exit"
    //   >
    //     <main>
    //       <div style={{ color: "oklch(0.71 0.2086 263.9" }}>🏩 Hello Page!</div>
    //     </main>
    //     {/*<AsyncPage key={router.getCurrentPage} />*/}
    //   </motion.div>
    // </AnimatePresence>
  );
});
