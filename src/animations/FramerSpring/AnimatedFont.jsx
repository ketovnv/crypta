import { motion, AnimatePresence } from 'framer-motion';
import { Text } from '@mantine/core';
import { useState, useEffect } from 'react';
import { fontFamilies } from '../styles/fontFamilies';

export const AnimatedFont = ({ text = "Пример текста" }) => {
  const [currentFontIndex, setCurrentFontIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFontIndex((prev) =>
        (prev + 1) % fontFamilies.length
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentFontIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
      >
        <Text
          size="xl"
          style={{
            fontFamily: fontFamilies[currentFontIndex],
            textAlign: 'center'
          }}
        >
          {text}
        </Text>
      </motion.div>
    </AnimatePresence>
  );
};
