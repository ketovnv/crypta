import {motion} from "motion/react";
import classes from "./GradientText.module.css";

export default function GradientText({
                                         children,
                                         className = "",
                                         colors = ["#1050CC", "#4079ff", "#1050CC", "#4079ff", "#1050CC"], // Default colors
                                         animationSpeed = 2, // Default animation speed in seconds
                                         showBorder = false, // Default overlay visibility
                                         active = false
                                     }) {
    const gradientStyle = {
        backgroundImage: `linear-gradient( ${active ? "to left" : "to right"}, ${colors.join(", ")})`,
        animationDuration: `${animationSpeed}s`,
    };
    if (active) colors = ["#10FFCC", "#40CCff", "#10FFCC", "#40CCff", "#10FFCC"]
    return (
        <motion.div
            className={`animated-gradient-text ${className}`}>
            {showBorder && <motion.div className="gradient-overlay" style={gradientStyle}></motion.div>}
            <span className={classes.textContent} style={gradientStyle}>{children}</span>
        </motion.div>
    );
}
