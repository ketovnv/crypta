import React from "react";
import { animated, useSpring } from "@react-spring/web";
import { animation } from "@stores/animation.js";

const AppearanceAnimation = ({ condition, children }) => {
  const { currentAnimation } = animation;
  const springProps = useSpring({
    opacity: currentAnimation === null && condition ? 1 : 0,
    scale: currentAnimation === null && condition ? 1 : 0,
    from: { opacity: 0, scale: 0 },
    config: { mass: 1, tension: 280, friction: 60 },
  });

  return (
    <animated.div style={{ ...springProps, position: "absolute" }}>
      {children}
    </animated.div>
  );
};

export default AppearanceAnimation;
