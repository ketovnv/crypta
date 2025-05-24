import { observer } from "mobx-react-lite";
import { NavBarMoving } from "@animations/involved/units";

export const AnimationObserver = observer(() => {
  // useEffect(() => {}, []);

  return (
    <>
      <NavBarMoving />
    </>
  );
});
