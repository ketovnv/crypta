import { animation } from "@stores/animation";
import { useAnimation } from "motion/react";
import params from "./configs/navBarMoving.json";

export const NavBarMoving = () => {
  const control = useAnimation();
  const newAnimation = { NavBarMoving: { control, ...params } };
  console.log("newAnimation", newAnimation);
  animation.setMantineControlAnimation(newAnimation);
  return null;
};
