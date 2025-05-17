import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

const AppearingText = ({ text,fontSize=20, speed=10,...props }) => {
  // Состояние для текста с эффектом печатания
  const [appearingText, setAppearingText] = useState("");
  const fullText = text;
  const [charIndex, setCharIndex] = useState(0);
  // springOpacity = new SpringValue(0)
  //
  // toggle = () => {
  //   this.springOpacity.start(isShowing ? 0 : 1)
  //
  //   this.isShowing = !this.isShowing
  // }
  // Эффект печатания
  useEffect(() => {
    if (charIndex < fullText.length) {
      const timer = setTimeout(() => {
        setAppearingText((prev) => prev + fullText[charIndex]);
        setCharIndex(charIndex + 1);
      }, 1000/speed);
      return () => clearTimeout(timer);
    }
  }, [charIndex]);

  return (
    <motion.span layout style={{fontSize,...props}}>
      {appearingText}
    </motion.span>
  );
};

export default AppearingText;
