import { AppShell } from "@mantine/core";
import { animated } from "@react-spring/web";
import { observer } from "mobx-react-lite";
import { animation } from "@stores/animation.js";
import { PageTransition } from "@animations/involved/units/PageTransition";

export const MainContent = observer(() => {
  // import assert from 'assert'
  // import { isValidChecksumAddress, unpadBuffer } from '@ethereumjs/util'

  // assert.ok(isValidChecksumAddress('0x2F015C60E0be116B1f0CD534704Db9c92118FB6A'))
  //
  // assert.ok(unpadBuffer(Buffer.from('000000006600', 'hex')).equals(Buffer.from('6600', 'hex')))
  const themeStyle = animation.themeController.springs;

  return (
    <AppShell.Main>
      <animated.div
        style={{
          ...themeStyle,
          height: "100vh",
          width: "100vw",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <h2 style={{ position: "absolute", left: 150, top: 150 }}>
          {JSON.stringify(themeStyle)}
        </h2>
        <animated.div
          style={{
            ...animation.getSpringAnimation("PageWithNavBarMoving"),
          }}
        >
          <PageTransition />
        </animated.div>
      </animated.div>
    </AppShell.Main>
  );
});
