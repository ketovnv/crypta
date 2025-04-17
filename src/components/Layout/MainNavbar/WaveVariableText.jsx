import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useState } from "react";

const WaveVariableText = () => {
  const weight = useMotionValue(100);
  const width = useMotionValue(100);
  const slant = useMotionValue(0);
  const opticalSize = useMotionValue(36);
  const gradient = useMotionValue(0);

  const color = useTransform(weight, [100, 900], ["#00ffff", "#ff00ff"]);
  const [time, setTime] = useState(1);

  useAnimationFrame(() => {
    setTime((prev) => prev + 0.05);
    weight.set(100 + Math.sin(time / 5) * 700);
    width.set(100 + Math.cos(time * 1.2) * 25);
    slant.set(Math.sin(time * 0.8) * 10);
    opticalSize.set(36 + Math.sin(time * 1.5) * 10);
    gradient.set(Math.cos(time * 1.3) * 100);
  });

  return (
    <motion.h1
      style={{
        fontSize: "80px",
        color,
        fontFamily: "'SF Pro Rounded', sans-serif",
        textShadow: "0px 4px 10px rgba(0,0,0,0.3)",
        fontWeight: weight.get(),
        fontVariationSettings: `"width" ${width.get()}, "slant" ${slant.get()}, "opticalSize" ${opticalSize.get()}, "GRAD" ${gradient.get()}`,
        transform: `translateX(${Math.sin(time) * -3}px)`, // Добавляем волновое движение
      }}
    >
      WAVY TEXT
    </motion.h1>
  );
};

export default WaveVariableText;
