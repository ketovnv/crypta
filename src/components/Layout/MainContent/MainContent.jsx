import { AppShell } from "@mantine/core";
import { PageTransition } from "@animations/current/PageTransitions/PageTransition";
import { animation } from "@stores/animation.js";
import { animated, useSpring } from "@react-spring/web";
import { observer } from "mobx-react-lite";
import classes from "./MainContent.module.css";

export const MainContent = observer(() => {
  const { navbarX } = animation;
  const closedWidth = window.innerWidth * 0.8;
  const openWidth = window.innerWidth * 0.9 - 350;

  // const variants = {
  //   hidden: { opacity: 0, y: -40 },
  //   visible: { opacity: 1, y: 0 },
  //   exit: { opacity: 0, y: 40 },
  // };

  const springProps = useSpring({
    x: navbarX + 100,
    // from: { width: openWidth, y: -75 },
    // to: { width: closedWidth, y: +75 },
    config: { mass: 75, tension: 280, friction: 120, delay: 100 },
  });

  return (
    <AppShell.Main className={classes.mainContent}>
      <animated.div
        style={{
          ...springProps,
          width: openWidth,
        }}
      >
        <PageTransition />
      </animated.div>
    </AppShell.Main>
  );
});
