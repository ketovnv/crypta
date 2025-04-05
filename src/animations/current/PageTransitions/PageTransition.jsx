import {observer} from "mobx-react-lite";
import {router} from "@stores/router";
import loadable from "@loadable/component";
import {AnimatePresence, motion} from "motion/react";
import {logger} from "@stores/logger.js";

const AsyncPage = loadable(
    (props) => import(`../../../components/pages/${props.page}`),
    {
        cacheKey: (props) => props.page,
    },
);
logger.logWhiteRandom("📺", " Компонент PageTransition", 12);

export const PageTransition = observer(() => {
    const variants = {
        hidden: {
            opacity: 0,
            rotateX: -90,
            scale: 0.01,

            // transition: {delay: 0.75},
        },
        visible: {
            opacity: 1,
            rotateX: 0,
            scale: 1,
            // transition: {duration: 1},
        },
        exit: {
            opacity: 0,
            rotateX: -200,
            // x: 200,
            scale: 3,
        },
    };

    return (
        <AnimatePresence style={{width: "100%", height: "100%"}}>
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
                transition={{type: "spring", stiffness: 100, damping: 20, mass: 5}}
            >
                <AsyncPage page={router.getCurrentPage}/>
            </motion.div>
        </AnimatePresence>
    );
});
