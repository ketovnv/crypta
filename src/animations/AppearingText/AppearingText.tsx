import React, { useState, useEffect } from 'react';
import { Text } from '@mantine/core';
const AppearingText = ({text,props}) => {
  // Состояние для текста с эффектом печатания
  const [appearingText, setAppearingText] = useState('');
  const fullText = text;
  const [charIndex, setCharIndex] = useState(0);

  // Эффект печатания
  useEffect(() => {
    if (charIndex < fullText.length) {
      const timer = setTimeout(() => {
        setAppearingText(prev => prev + fullText[charIndex]);
        setCharIndex(charIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [charIndex]);

  return   <Text {...props}>{appearingText}</Text>




};

export default AppearingText;