import {AnimatePresence, motion} from 'motion/react';
import {Text} from '@mantine/core';
import {useEffect, useState} from 'react';
import classes from "@styles/fonts.module.css";

export const AnimatedFontDisplay = ({text = "Crypta"}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const totalFonts = 96; // Количество шрифтов в вашем модуле

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalFonts);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentIndex}
                initial={{opacity: 0, scale: 0.8}}
                animate={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 20
                    }
                }}
                exit={{opacity: 0, scale: 1.2}}
            >
                <Text
                    className={`${classes[`font${currentIndex}`]}`}
                    size="xl"
                    align="center"
                    style={{fontSize: "2.5rem"}}
                >
                    {text}
                </Text>
            </motion.div>
        </AnimatePresence>
    );
};
