import { AppShell, Text } from "@mantine/core";
import { PageTransition } from "@animations/current/PageTransitions/PageTransition";
import { uiStore } from "@stores/ui.js";
import { animation } from "@stores/animation.js";
import { animated, useSpring } from "@react-spring/web";
import { observer } from "mobx-react-lite";

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
    x: navbarX + 75,
    width: uiStore.isNavbarOpened ? openWidth : closedWidth,
    from: { x: -350, width: openWidth },
    config: { mass: 50, tension: 280, friction: 120, delay: 50 },
  });

  return (
    <AppShell.Main
    // style={{ overflow: "hidden", background: getThemeBackGround }}
    >
      <Text>{animation.getThemeBackGround}</Text>
      <animated.div
        style={{
          ...springProps,
          position: "absolute",
          top: 75,
        }}
      >
        <PageTransition />
      </animated.div>
    </AppShell.Main>
  );
});
