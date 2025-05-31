import React, { useRef } from "react";
import { Center } from "@mantine/core";
import {
  motion,
  //@ts-ignore
  useMotionValue,
  //@ts-ignore
  useTransform,
} from "motion/react";
//@ts-ignore
import classes from "./AwesomeButton.module.css";
import "./ButtonContainer.css";

const POSITION_STATES = ["middle", "left", "right"];

// .aws-btn--left:before {
//   transform: skewY(calc(1deg * var(--button-hover-pressure) * 1)) translate3d(0, calc(-1px * var(--button-hover-pressure) / 2), 0)
// }
//
// .aws-btn--left .aws-btn__content {
//   transform: skewY(calc(1deg * var(--button-hover-pressure) * -1))
// }
//
// .aws-btn--right:before {
//   transform: skewY(calc(1deg * var(--button-hover-pressure) * -1)) translate3d(0, calc(-1px * var(--button-hover-pressure) / 2), 0)
// }
//
// .aws-btn--right .aws-btn__content {
//   transform: skewY(calc(1deg * var(--button-hover-pressure) * 1))
// }
//
// .aws-btn--middle:before {
//   transform: translate3d(0, calc(-1px * var(--button-hover-pressure)), 0)
// }
//
// .aws-btn--middle .aws-btn__content {
//   transform: translate3d(0, calc(1px * var(--button-hover-pressure)), 0)
// }

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
  skewY?: null;
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
  skewY = null,
}: ButtonType) => {
  const buttonRef = useRef(null);
  const contentRef = useRef(null);

  const handlePress = (onPress: any) => {
    return null;
  };
  //   if (onPress) onPress();
  // };
  //
  // Motion values for tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  //
  // // Transform mouse position to rotation values
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  //
  // // Handle mouse movement over the button
  // const handleMouseMove = (event) => {
  //   if (!buttonRef.current) return;
  //
  //   const rect = buttonRef.current.getBoundingClientRect();
  //   const width = rect.width;
  //   const height = rect.height;
  //
  //   // Calculate mouse position relative to button center (values between -0.5 and 0.5)
  //   const x = (event.clientX - rect.left) / width - 0.5;
  //   const y = (event.clientY - rect.top) / height - 0.5;
  //
  //   // Update motion values
  // mouseX.set(x);
  // mouseY.set(y);
  // };
  //
  // // Reset tilt on mouse leave

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Scale effect for button on hover and tap
  const buttonHoverVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  return (
    <motion.div
      className="button-container"
      style={{
        perspective: 800,
        ...style,
      }}
    >
      <motion.button
        ref={buttonRef}
        // onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlePress(onPress)}
        layout
        layoutId={layoutId}
        key={buttonKey}
        variants={variants || buttonHoverVariants}
        initial="initial"
        whileHover={whileHover || "hover"}
        whileTap={whileTap || "tap"}
        animate={animate || (isActive ? "tap" : "initial")}
        style={{
          // rotateX,
          // rotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{
          rotateX: { type: "spring", stiffness: 300, damping: 15 },
          rotateY: { type: "spring", stiffness: 300, damping: 15 },
          default: { type: "spring", duration: 2 },
        }}
        className={`${classes.awsBtn} aws-btn aws-btn--visible`} // Added aws-btn--visible to make button visible
      >
        <motion.span
          className={
            classes[`mainNavBtnWrapper_` + buttonKey] + " aws-btn__wrapper"
          }
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(-0.5px)",
          }}
        >
          <motion.div
            ref={contentRef}
            className={`${classes.mainNavBtnContent} aws-btn__content`}
            initial={{ transform: "translate3d(0, 0, 0)" }}
            animate={{
              transform: isActive
                ? "translate3d(0, 3px, 0)"
                : "translate3d(0, 0, 0)",
              background: background,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              background: { duration: 0.3 },
            }}
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(1px)",
            }}
          >
            <Center mr={before ? 12 : 0}>{before}</Center>
            <Center>{children}</Center>
            {after}
          </motion.div>
          {extra}
        </motion.span>
      </motion.button>
    </motion.div>
  );
};
