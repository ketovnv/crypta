import { createNoiseSVG } from "./effects/noiseSVG";
import React from "react";
import {Button} from "@mantine/core";
import classes from "./effects/classes.module.css";



export const BlackCoilTexture = ({ children, background = "#202020", ...props }) => (
  <Button
    className={classes.cardHoverEffect}
      style={{
      background,
      height: props.height || "300px",
      backgroundImage: `${createNoiseSVG(0.45, 3)}, 
                               linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0) 100%)`,
      backgroundBlendMode: "soft-light, overlay"

    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.25, 4)}, 
                linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0) 100%)`;
      e.currentTarget.style.boxShadow =
        "inset 0 2px 8px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundImage = `${createNoiseSVG(0.45, 3)}, 
                linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0) 100%)`;
      e.currentTarget.style.boxShadow =
        "inset 0 1px 4px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)";
    }}
  >
    {children}
  </Button>
);
