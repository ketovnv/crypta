import { motion } from "motion/react";
import classes from "./GradientText.module.css";

export default function GradientText({
  children,
  className = "",
  colors = ["#10CCDD", "#4079ff", "#1088DD", "#4079ff", "#1050CC"], // Default colors
  animationSpeed = 2, // Default animation speed in seconds
  showBorder = false, // Default overlay visibility
  isActive = false,
}) {
  if (isActive) {
    colors = ["#FF9900", "#FFDD00", "#FFCC00", "#FFEE00", "#FFFF99"];
  }

  return (
    <motion.span
      className={classes.textContent}
      transition={{
        duration: 0.5,
        ease: "linear",
      }}
      animate={{
        backgroundImage: `linear-gradient( in oklch ${isActive ? "to left" : "to right"}, ${colors.join(", ")})`,
        animationDuration: `${animationSpeed}s`,
      }}
    >
      {children}
    </motion.span>
  );
}
