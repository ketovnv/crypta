import { AppShell } from "@mantine/core";
import { animated } from "@react-spring/web";
import { observer } from "mobx-react-lite";
import { animation } from "@stores/animation.js";
// import { PageTransition } from "@animations/involved/units/PageTransition";
import { uiStore } from "@stores/ui.js";
// import {SmoothCursor} from "@animations/involved/SmoothCusor.js";
import { animationEngine } from "@animations/animationEngine";

export const MainContent = observer(() => {
  const themeStyle = animation.themeController.springs;

  return (
    <AppShell.Main>
      <animated.div
        style={{
          ...themeStyle,
          // background: "transparent",
          height: "100vh",
          width: "100vw",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <animated.div
          style={{
            ...animationEngine.getPageWithNavBarValues(),
          }}
        >
          <span>321</span>
          {/*<PageTransition />*/}
        </animated.div>
      </animated.div>

      {/*<SmoothCursor />*/}
    </AppShell.Main>
  );
});
