import React, { useEffect } from "react";
import { animated, useSpringRef, useTransition } from "@react-spring/web";
import { Center } from "@mantine/core";
import classes from "./Options.module.css";
import { animationStore } from "@stores/animation.js";
import { observer } from "mobx-react-lite";
import { logger } from "@stores/logger.js"; // import AnimatedNumber from "@animations/AnimatedNumber";
// import AnimatedNumber from "@animations/AnimatedNumber";
// import AnimatedText from "@animations/textures/AnimatedText.tsx";
// import AnimatedTextures from "@animations/textures/AnimatedTextures";
// import DarkStaticTextures from "@animations/textures/DarkStaticTextures";
// import NoiseTextures from "@animations/textures/NoiseTextures";
// import StaticTextures from "@animations/textures/StaticTextures";
// import TextureEffects from "@animations/textures/TextureEffects";
// import AnimatedTexturesOne from "@animations/textures/AnimatedTexturesOne";
// import {FontTest} from "@components/Pages/Options/FontTest.jsx";

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
  const transitions = useTransition(
    animationStore.optionsTransitionsTestState,
    {
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
        backgroundColor: colors[animationStore.optionsTransitionsTestState],
        // color: "FFFF00 !important",
      },
      leave: {
        opacity: 0,
        transform: "translate3d(-50%,0,0)",
        backgroundColor: "#000000",
        // color: "#000000  !important",
      },
    },
  );
  useEffect(() => {
    transRef.start();
  }, [animationStore.optionsTransitionsTestState]);
  return (
    <Center
      m={0}
      className={classes.container}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        borderRadius: 20,
        height: 575,
        // background: "linear-gradient(#CC50CC,#AA79ff,#1050CC,#BB50CC)",
      }}
    >
      {transitions((style, i) => {
        const Page = pages[i];
        return <Page style={style} key={style.color} />;
      })}
    </Center>
  );
});

export default Options;
