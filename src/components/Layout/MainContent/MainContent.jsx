import { AppShell } from "@mantine/core";
import { animated } from "@react-spring/web";
import { observer } from "mobx-react-lite";
import { PageTransition } from "@animations/involved/units/PageTransition";
import { uiStore } from "@stores/ui.js";
import { gradientStore } from "@stores/gradient.js";
import { LJ } from "@components/logger/LJ.jsx";
// import {SmoothCursor} from "@animations/involved/SmoothCusor.js";
// import { animations } from "@stores/animations";
// import { gradientStore } from "@stores/gradient.js";

export const MainContent = observer(() => {
  return (
    <AppShell.Main>
      <animated.div
        style={{
          ...gradientStore.animatedTheme,
          // background: "transparent",
          height: "100vh",
          width: "100vw",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <PageTransition />
      </animated.div>
      {/*</animated.div>*/}

      {/*<SmoothCursor />*/}
    </AppShell.Main>
  );
});
