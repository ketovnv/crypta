import { observer } from "mobx-react-lite";
import { NavBarMoving, PageWithNavBarMoving } from "@animations/involved/units";
import { logger } from "@stores/logger.js"; // import assert from 'assert'

export const AnimationObserver = observer(() => {
  logger.info("💎init💎", "AnimationObserver👻👻");

  return (
    <>
      <NavBarMoving />
      <PageWithNavBarMoving />
    </>
  );
});
