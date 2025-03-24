import React, { useEffect, useState } from "react";
import { Text } from "@mantine/core";

const AppearingText = ({ text, props }) => {
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
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [charIndex]);

  return (
    <Text fz={20} {...props}>
      {appearingText}
    </Text>
  );
};

export default AppearingText;
