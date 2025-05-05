import{useEffect}   from 'react';
import { observer } from "mobx-react-lite";
import { NavBarMoving, PageWithNavBarMoving } from "@animations/involved/units";
import {uiStore} from "@stores/ui.js";

export const AnimationObserver = observer(() => {
    useEffect(() => {

    }, []);
  return (
    <>
      <NavBarMoving />
      <PageWithNavBarMoving />
    </>
  );
});
