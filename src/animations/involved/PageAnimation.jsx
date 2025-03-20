import { motion } from "motion/react";
import {animationStore} from '@stores/animation.js';
import {useLayoutEffect} from "react";

export const PageAnimation = ({ children }) => {
    const { setCurrentAnimation, clearCurrentAnimation } = animationStore;

    useLayoutEffect(() => {
        if(!animationStore.currentAnimation) return;
        setCurrentAnimation('pageTransition');
        // Анімація переходу сторінки
        setTimeout(() => {
            clearCurrentAnimation();
        }, 500);
    }, [setCurrentAnimation, clearCurrentAnimation]);

    const animations = {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            variants={animations}
            initial="initial"
            animate="animate"
            transition={{ duration: .5 }}
        >
            {children}
        </motion.div>
    );
};
