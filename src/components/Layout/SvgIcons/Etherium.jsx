import {motion, MotionConfig} from "motion/react";
import {observer} from "mobx-react-lite";
import {animation} from "@stores/animation.js";
import {uiStore} from "@stores/ui.js";
import {router} from "@stores/router.js";

export const Etherium = observer(({width =22, height = 42, color1, color2, ...props}) => {


    return (
        <MotionConfig  transition={{
            repeat: Infinity,
            repeatType: "reverse", type: 'spring', stiffness: 400, damping: 200, friction: 50, mass: 25
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 784.3699951171875 1277.3800048828125"
                 width={width}
                 height={height}
                 {...props}
        >
                <filter
                    id="shadow"
                    x="0"
                    y="0"
                    width="200%"
                    height="200%"
                    floodOpacity="0.5"
                >
                    <motion.feDropShadow
                        dx="0.3"
                        dy="0.3"
                        stdDeviation="0.7"
                        initial={{floodColor: "hsl(181.99 50.99% 95%)"}}
                        animate={{floodColor: router.isActiveEtherium? "hsl(41.87 100.99% 53%)" : "hsl(201.53 56.99% 38%)"}}
                        floodColor="hsl(360 100% 49%)"
                        floodOpacity="0.7"
                    />
                    <motion.feDropShadow
                        dx="0.5"
                        dy="0.7"
                        stdDeviation="0.7"
                        initial={{floodColor: "hsl(181.99 50.99% 95%)"}}
                        animate={{floodColor:  router.isActiveEtherium? "hsl(41.87 94.99% 53%)" : "hsl(201.53 56.99% 38%)"}}
                        floodColor="hsl(100 100% 35%)"
                        floodOpacity="0.7"
                    />
                    <motion.feDropShadow
                        dx="0.5"
                        dy="2"
                        stdDeviation="1"
                        initial={{floodColor: "hsl(181.99 50.99% 95%)"}}
                        animate={{floodColor:  router.isActiveEtherium? "hsl(45.87 94.99% 53%)"  : "hsl(201.53 56.99% 38%)"}}
                        floodColor="hsl(0 100% 35%)"
                        floodOpacity="0.5"
                    />
                </filter>
        <motion.g  filter="url(#shadow)" xmlns="http://www.w3.org/2000/svg" id="_1421394342400">
            <motion.g filter="url(#shadow)"   animate={{scale: uiStore.themeIsDark? 1:0.9}}>
                <motion.polygon  filter="url(#shadow)" animate={{fill: animation.theme.color}} fillRule="nonzero"
                         points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
                <motion.polygon  animate={{fill : router.isActiveEtherium? "hsl(45.87 94.99% 53%)"  : "hsl(201.53 56.99% 38%)"}} fillRule="nonzero"
                                points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>
                <motion.polygon fill="#3C3C3B" fillRule="nonzero"
                         points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
                <motion.polygon animate={{fill: animation.theme.color}} fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>
                <motion.polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>

                <  motion.polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/>
            </motion.g>
        </motion.g>
            </svg>
        </MotionConfig>)
})
