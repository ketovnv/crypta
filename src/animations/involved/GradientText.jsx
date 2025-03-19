import { Center } from "@mantine/core";

export default function GradientText({
                                         children,
                                         className = "",
                                         colors = ["#1050CC", "#4079ff", "#1050CC", "#4079ff", "#1050CC"], // Default colors
                                         animationSpeed = 2, // Default animation speed in seconds
                                         showBorder = false, // Default overlay visibility
                                     }) {
    const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
        animationDuration: `${animationSpeed}s`,
    };

    return (
        <div className={`animated-gradient-text ${className}`}>
            {showBorder && <div className="gradient-overlay" style={gradientStyle}></div>}
            <Center className="text-content" style={gradientStyle}>{children}</Center>
        </div>
    );
}
