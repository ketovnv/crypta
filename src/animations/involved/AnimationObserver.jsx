import { observer } from "mobx-react-lite";
import { NavBarMoving, PageWithNavBarMoving } from "@animations/involved/units";

export const AnimationObserver = observer(() => {
  return (
    <>
      <NavBarMoving />
      <PageWithNavBarMoving />
    </>
  );
});
