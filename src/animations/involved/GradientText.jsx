import { motion } from "motion/react";
import classes from "./GradientText.module.css";
import { uiStore } from "@stores/ui.js";
import { GradientMaker } from "@components/classes/GradientMaker.js";
import { logger } from "@stores/logger.js";

export default function GradientText({
  children,
  className = "",
  colors = null,
  themeIsVeryColorised = false,
  animationDuration = 3,
  fontSize = 14,
  fontWeight = 500,
  isActive = false,
  fontFamily = "SF Pro Rounded",
  ...props
}) {
  if (colors === null) {
    colors = uiStore.getTthemeIsVeryColorised
      ? uiStore.themeIsDark
        ? ["#DDDDDD", "#333333", "#FFFFFF", "#555555", "#EEEEEE"]
        : ["#444444", "#222222", "#555555", "#777777", "#000000"]
      : uiStore.themeIsDark
        ? ["#00FF00", "#FFFF00", "#FF00FF", "#FF0000", "#0000FF"]
        : ["#007700", "#777700", "#770077", "#990000", "#000088"];
  }

  logger.warning("GradientText", "Gradienr text Render!!!", 32);
  return (
    <motion.span
      className={classes.textContent}
      transition={{
        duration: 2,
        ease: "linear",
      }}
      style={{ fontSize, fontWeight, fontFamily }}
      animate={{
        fontWeight,
        backgroundImage: `linear-gradient( in oklch ${isActive ? "to left" : "to right"}, ${GradientMaker.scaleGradient(colors, 10)})`,
        animationDuration: `${animationDuration}s`,
      }}
      {...props}
    >
      {children}
    </motion.span>
  );
}
