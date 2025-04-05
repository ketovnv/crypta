import {animation} from "@stores/animation";
import {useAnimation} from "motion/react";
import params from "./configs/navBarMoving";

export const NavBarMoving = () => {
    const control = useAnimation();
    const newAnimation = {NavBarMoving: {...params, control}};
    animation.setMantineControlAnimation(newAnimation);
    return null;
};
