import { AppShell } from "@mantine/core";
import { PageTransition } from "@animations/involved/units/PageTransition.jsx";
import { animated } from "@react-spring/web";
import { motion } from "motion/react";
import { observer } from "mobx-react-lite";
import classes from "./MainContent.module.css";
import { animation } from "@stores/animation.js";

export const MainContent = observer(() => {
  // import assert from 'assert'
  // import { isValidChecksumAddress, unpadBuffer } from '@ethereumjs/util'

  // assert.ok(isValidChecksumAddress('0x2F015C60E0be116B1f0CD534704Db9c92118FB6A'))
  //
  // assert.ok(unpadBuffer(Buffer.from('000000006600', 'hex')).equals(Buffer.from('6600', 'hex')))

  return (
    <AppShell.Main className={classes.mainContent}>
      <motion.div
        style={{
          height: "100vh",
          width: "100vw",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        animate={{ background: animation.getThemeColors.background }}
        transition={{ duration: 3.5 }}
      >
        <animated.div
          style={{
            ...animation.getSpringAnimation("PageWithNavBarMoving"),
          }}
        >
          <PageTransition />
        </animated.div>
      </motion.div>
    </AppShell.Main>
  );
});
