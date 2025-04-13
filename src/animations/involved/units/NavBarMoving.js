import { animation } from "@stores/animation";
import { useAnimation } from "motion/react";

export const NavBarMoving = () => {
  const control = useAnimation();
  const newAnimation = { NavBarMoving: { control } };
  animation.setMantineControlAnimation(newAnimation);
  return null;
};
