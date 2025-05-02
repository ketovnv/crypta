import {motion} from "motion/react";
import {gradientStore} from "@stores/gradient.js";
import classes from "./GradientText.module.css";
import {uiStore} from "@stores/ui.js";

export default function GradientText({
  children,
  className = "",
                                         colors =
                                         uiStore.themeIsDark ?
                                             ["#00FF00", "#FFFF00", "#FF00FF", "#FF0000", "#0000FF"] :
                                             ["#007700", "#777700", "#770077", "#990000", "#000088"], // Default colors
                                         animationDuration = 3,
                                         fontSize = 14,
                                         fontWeight = 500,
                                         isActive = false,
                                         ...props

}) {


  return (
    <motion.span
      className={classes.textContent}
      transition={{
        duration: 0.5,
        ease: "linear",
      }}
      style={{fontSize, fontWeight, minWidth: children.length *12}}
      animate={{
          backgroundImage: `linear-gradient( in oklch ${isActive ? "to left" : "to right"}, ${gradientStore.scaleGradient(colors, 10)})`,
          animationDuration: `${animationDuration}s`,
      }}
      {...props}
    >
      {children}
    </motion.span>
  );
}
