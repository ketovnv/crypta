import React, { useEffect } from "react";
import { animated, useSpringRef, useTransition } from "@react-spring/web";
import { Center } from "@mantine/core";
import { animation } from "@stores/animation.js";
import { observer } from "mobx-react-lite";
import { logger } from "@stores/logger.js"; // import AnimatedNumber from "@animations/AnimatedNumber";

const pages = [
  ({ style }) => (
    <animated.div style={style}>
      {logger.returnJSON("style:", style)}
    </animated.div>
  ),
  ({ style }) => (
    <animated.div style={style}>
      {logger.returnJSON("style:", style)}
    </animated.div>
  ),
  ({ style }) => (
    <animated.div style={style}>
      {logger.returnJSON("style:", style)}
    </animated.div>
  ),
];

const colors = ["#1050CC", "#FFFF00", "#FF50CC"];

const Options = observer(() => {
  const transRef = useSpringRef();
  const transitions = useTransition(animation.optionsTransitionsTestState, {
    ref: transRef,
    config: { tension: 280, friction: 800 },
    keys: null,
    from: {
      opacity: 0,
      transform: "translate3d(100%,0,0)",
      backgroundColor: "#000000",
      // color: "#000000 !important",
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0%,0,0)",
      backgroundColor: colors[animation.optionsTransitionsTestState],
      // color: "FFFF00 !important",
    },
    leave: {
      opacity: 0,
      transform: "translate3d(-50%,0,0)",
      backgroundColor: "#000000",
      // color: "#000000  !important",
    },
  });
  useEffect(() => {
    transRef.start();
  }, [animation.optionsTransitionsTestState]);
  return (
    <Center m={0} className="pageWrapper">
      {transitions((style, i) => {
        const Page = pages[i];
        return <Page style={style} key={style.color} />;
      })}
    </Center>
  );
});

export default Options;
