import { AppShell } from "@mantine/core";
import { observer } from "mobx-react-lite"; // import classes from "./MainFooter.module.css";
import { AnimatePresence, motion } from "motion/react";
import { router } from "@stores/router";
import React, { useEffect, useState } from "react";
import GradientText from "@animations/involved/GradientText.jsx";
import { Bun } from "../SvgIcons/Bun";
import { ReactSVG } from "../SvgIcons/ReactSVG";
import { uiStore } from "@stores/ui";
import { GradientMaker } from "@components/classes/GradientMaker";
import { Etherium } from "../SvgIcons/Etherium";
import { Vite } from "../SvgIcons/Vite";
import { Tailwindcss } from "../SvgIcons/Tailwindcss";
import { USDT } from "@components/Layout/SvgIcons/USDT";
import { Tron } from "@components/Layout/SvgIcons/Tron";
import { Tauri } from "@components/Layout/SvgIcons/Tauri";
import { Motion } from "@components/Layout/SvgIcons/Motion";
import { Spring } from "@components/Layout/SvgIcons/Spring";
import { MobX } from "@components/Layout/SvgIcons/MobX";
import { Reown } from "@components/Layout/SvgIcons/Reown";

// Стили для контента

export const MainFooter = observer(() => {
  if (!uiStore.renderFooter) return null;

  const [canChangeColor, setCanChangeColor] = useState(false);

  if (!canChangeColor) setTimeout(() => setCanChangeColor(true), 0);
  useEffect(() => {
    const theme = localStorage.getItem("app-color-scheme");

    uiStore.setColorScheme(theme);
  }, []);
  const marqueeVariants = {
    animate: {
      y: 0,
      opacity: 1,
      x: [500, "-100vw"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 95, // Медленное движение
          ease: "linear",
        },
      },
    },
  };

  return (
    <AppShell.Footer
      style={{
        border: "none",
        background: "rgb(0, 0, 0, 0)",
      }}
    >
      <AnimatePresence>
        {!uiStore.isNavbarOpened && (
          <motion.div
            layout
            // key={uiStore.toggleNavbarOpened}
            variants={marqueeVariants}
            style={{
              display: "flex",
              gap: "24px",
              alignItems: "center",
            }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            animate="animate"
            exit={{ y: 50, opacity: 0 }}
          >
            {[...router.footerLinks, ...router.footerLinks].map(
              (link, index) => (
                <motion.a
                  layoutId="link"
                  key={link[0] + index + link[1]}
                  layout
                  whileHover="hover"
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.2 },
                  }}
                  transition={{
                    type: "spring",
                    visualDuration: 5,
                    bounce: 0.7,
                    delay: index / 2,
                  }}
                  style={{ fontFamily: "SF Pro Rounded Black" }}
                  initial={{
                    marginLeft: 10,
                    filter: "blur(2px)",
                    padding: 0,
                    opacity: 0,
                    width: 150,
                  }}
                  variants={{ hover: { scale: 1.5, padding: 20, opacity: 1 } }}
                  animate={{
                    marginLeft: 100,
                    y: 20,
                    filter: "blur(0px)",
                    padding: 20,
                    opacity: 1,
                    width: 250,
                  }}
                  href={link[1]}
                  target="_blank"
                >
                  {link[0] === "Reown" && <Reown width={125} key={link[0]} />}
                  {link[0] === "MobX" && <MobX width={25} key={link[0]} />}
                  {link[0] === "Motion" && <Motion width={42} key={link[0]} />}
                  {link[0] === "Spring" && <Spring width={42} key={link[0]} />}
                  {link[0] === "Tauri" && <Tauri width={32} key={link[0]} />}
                  {link[0] === "Tron" && <Tron width={42} key={link[0]} />}
                  {link[0] === "USDT" && (
                    <USDT
                      width={50}
                      key={link[0]}
                      isDark={canChangeColor ? uiStore.themeIsDark : "dark"}
                    />
                  )}
                  {link[0] === "Tailwindcss" && (
                    <Tailwindcss size={50} key={link[0]} />
                  )}
                  {link[0] === "Vite" && <Vite width={32} key={link[0]} />}
                  {link[0] === "Etherscan" && (
                    <Etherium width={25} key={link[0]} />
                  )}
                  {link[0] === "Bun" && <Bun size={18} key={link[0]} />}
                  {link[0] === "React" && (
                    <ReactSVG
                      key={link[0]}
                      size={32}
                      isDark={canChangeColor ? uiStore.themeIsDark : "dark"}
                    />
                  )}
                  {["ChromaJS"].includes(link[0]) && (
                    <GradientText
                      fontSize={26}
                      colors={GradientMaker.getRainbowGradient}
                      fontWeight={700}
                    >
                      <motion.span>{link[0]}</motion.span>
                    </GradientText>
                  )}
                </motion.a>
              ),
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell.Footer>
  );
});
