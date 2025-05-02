import React, { useRef } from "react";
import { Center } from "@mantine/core";
import { motion } from "motion/react"; // @ts-ignore
import { router } from "@stores/router"; // @ts-ignore
import classes from "./AwesomeButton.module.css";

const POSITION_STATES = ["middle", "left", "right"];

const Button = React.forwardRef<HTMLButtonElement>((props, ref) => (
  <button ref={ref} {...props} />
));

export type ButtonType = {
  isActive?: boolean;
  after?: React.ReactNode;
  animate?: any;
  layoutId?: any;
  variants?: any;
  initial?: any;
  before?: React.ReactNode;
  between?: boolean;
  children?: React.ReactNode;
  className?: string;
  cssModule?: any;
  disabled?: boolean;
  element?: React.ForwardRefExoticComponent<
    React.RefAttributes<HTMLAnchorElement | HTMLDivElement | HTMLButtonElement>
  >;
  extra?: React.ReactNode;
  moveEvents?: boolean;
  background?: any;
  onMouseDown?: any;
  onMouseUp?: (event: React.MouseEvent | React.TouchEvent) => void;
  onPress?: any;
  onPressed?: any;
  whileTap?: any;
  whileHover?: any;
  onReleased?: (event: HTMLElement) => void;
  placeholder?: boolean;
  size?: string;
  style?: any;
  type?: string;
  buttonKey?: string;
  visible?: boolean;
};

export const AwesomeButton = ({
  after = null,
  layoutId = null,
  isActive = false,
  animate = null,
  variants = null,
  background = null,
  initial = null,
  whileTap = null,
  whileHover = null,
  onPress = null,
  buttonKey = "",
  before = null,
  children = null,
  extra = null,
  style = {},
}: ButtonType) => {
  const button = useRef(null);
  const content = useRef(null);
  const container = useRef(null);
  const child = useRef(null);
  const handlePress = (onPress: any) => {
    if (onPress) onPress();
    // return null;
  };

  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      animate={animate}
      onClick={() => handlePress(onPress)}
layout
      layoutId={layoutId}
      key={buttonKey}
      variants={variants}
      transition={{ type: "tween", duration: 0.5 }}
      style={{ ...style , fontFamily: 'Core Sans DS55 Bold'}}
      className={`${classes.awsBtn}  aws-btn`}
      ref={container}
    >
      <span
        ref={button}
        className={`${classes.mainNavBtnWrapper}  aws-btn__wrapper`}
      >
        <motion.div
          initial={{ transform: "translate3d(0, 0, 0 )" }}
          transition={{
            type: "tween",
            duration: 0.2,
            background: { duration: 3 },
          }}
          animate={{
            transform: isActive
              ? "translate3d(0, 3px, 0)"
              : "translate3d(0, 0, 0)",
            background: background,
          }}
          ref={content}
          className={`${classes.mainNavBtnContent}  aws-btn__content`}
        >
          <Center mr={before? 6 :0}>{before}</Center>
          <Center ref={child}>{children}</Center>
          {after}
        </motion.div>
        {extra}
      </span>
    </motion.button>
  );
};
