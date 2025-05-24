import React, { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { uiStore } from "@stores/ui.js";
// import { gpuStore } from "@stores/gpuStore.js";
import { windowStore } from "@stores/window.js";
import GradientText from "@animations/involved/GradientText.jsx";

const ResolutionsButtonsLayout = ({ width, height }) => {
  const resizeWindow = (res) => {
    alert("resize window");
    windowStore.applySize(res[0], res[1]);
    // gpuStore.setWindowSize(res[0], res[1]);
  };

  const styles = {
    container: {
      opacity: 0,
      flex: 1,
      display: "flex",
      padding: "1rem",
      flexDirection: "column",
      // boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      borderRadius: 16,
      margin: "0 auto",
      // overflow: 'hidden',
    },
    resolutionContainer: {
      position: "relative",
      overflow: "hidden",
      minHeight: "75px",
    },
    radioRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      justifyContent: "center",
      marginTop: 75,
      // overflow: 'hidden',
      // Оставляем место для выбранного элемента сверху
    },
    selectedResolutionContainer: {
      position: "absolute",
      top: 50,
      left: 0,
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
  };

  // Анимации для радио-кнопок разрешения в ряду
  const radioVariants = (res, isDark) => {
    return {
      hover: {
        fontWeight: 800,
        scale: 1.02,
        borderRadius: 10,
        background: `linear-gradient(135deg, ${getResolutionGradient(res)[0]} 0%,  ${getResolutionGradient(res)[1]} 100%)`,
        transition: { duration: 0.5, ease: "easeOut" },
      },
      tap: {
        scale: 0.95,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
        transition: { duration: 0.3, ease: "easeOut" },
      },
    };
  };

  // Анимации для выбранной кнопки
  const selectedVariants = {
    initial: {
      opacity: 0,
      scale: 0,
      // y: 0,
      fontWeight: 300,
      // boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
      // transition: {duration: 0.5, ease: 'easeOut'}
    },
    selected: {
      // opacity: 1,
      scale: [0, 1.33],
      opacity: [0, 1],
      y: [25, -42],
      fontWeight: 800,
      boxShadow: uiStore.themeStyle.boxShadow,
      transition: {
        duration: 2,
        scale: { duration: 4 },
        fontWeight: { delay: 2, duration: 1 },
      }, // Экспоненциальная кривая для плавности
    },
  };

  // Получаем градиенты в зависимости от разрешения
  const getResolutionGradient = (res) => {
    switch (res) {
      case 800:
        return ["#FF9A9EFF", "#FECFEFFF"];
      case 1024:
        return ["#A1C4FDFF", "#C2E9FBFF"];
      case 1920:
        return ["#84FAB0FF", "#8FD3F4FF"];
      case 2560:
        return ["#8E2DE2FF", "#4A00E0FF"];
      default:
        return ["#84FAB0FF", "#8FD3F4FF"];
    }
  };

  // Создаем функцию для генерации общего компонента кнопки разрешения
  const ResolutionButton = ({ res, isSelected, position = "row", onClick }) => {
    return (
      <motion.div
        layoutId={`resolution-${res[0]}`}
        style={{
          scale: 1,
          // boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
          fontFamily: "Nunito",
          background: `linear-gradient(135deg, #0000000F 5%,  #FFFFFF0F 100%)`,
          padding: 10,
          borderRadius: 10,
          cursor: "pointer",
          border: "2px solid transparent",
          fontWeight: 400,
          position: "relative",
          overflow: "hidden",
          zIndex: 1,
        }}
        variants={isSelected ? selectedVariants : radioVariants(res[0])}
        animate={"selected"}
        whileHover="hover"
        whileTap="tap"
        onClick={() => resizeWindow([...res])}
        transition={{
          duration: 0.5,
          layout: { duration: 0.5, ease: "easeInOut" },
        }}
      >
        {/* Эффект свечения для выбранной кнопки */}
        {/*{isSelected && (*/}
        {/*    <motion.div*/}
        {/*        layout*/}
        {/*        layoutId={`glow-${res[0]}`}*/}
        {/*        style={{*/}
        {/*            position: 'absolute',*/}
        {/*            top: '-50%',*/}
        {/*            left: '-50%',*/}
        {/*            width: '200%',*/}
        {/*            height: '200%',*/}
        {/*            zIndex: 0,*/}
        {/*        }}*/}
        {/*        animate={{*/}
        {/*            opacity: [0.2, 0.4, 0.2],*/}
        {/*            scale: [1, 1.1, 1],*/}
        {/*            background: `radial-gradient(circle, ${getResolutionGradient(res[0])[0]} 0%, ${getResolutionGradient(res[0])[1]} 70%)`,*/}
        {/*            transition: {*/}
        {/*                repeat: Infinity,*/}
        {/*                duration: 3,*/}
        {/*                ease: 'easeInOut'*/}
        {/*            }*/}
        {/*        }}*/}
        {/*    />*/}
        {/*)}*/}

        {/* Текст разрешения */}
        <motion.span
          layout
          // initial={{width: 0}}
          // animate={{width: 100}}
          layoutId={`text-${res[0]}`}
          style={{
            position: "relative",
            zIndex: 2,
            display: "block",
          }}
        >
          <GradientText fontFamily="Nunito" fontWeight={700}>
            {`${res[0]}x${res[1]}`}
          </GradientText>
        </motion.span>
      </motion.div>
    );
  };

  return (
    <motion.div
      animate={{ opacity: 1 }}
      style={styles.container}
      transition={{ duration: 2 }}
    >
      <div style={styles.resolutionContainer}>
        <LayoutGroup id="resolutions">
          {/* Выбранный элемент расположен сверху */}
          {/* <span>{width}</span>
                     <span>{height}</span> */}
          <div
            style={styles.selectedResolutionContainer}
            key={"container" + uiStore.themeIsDark}
          >
            <ResolutionButton
              key={`selected-${width}}`}
              res={[width, height]}
              isSelected={true}
              position="top"
              // onClick={()=>gpuStore.setWindowSize(gpuStore.currentMode.width,gpuStore.currentMode.height)}
            />
          </div>
          {/* Остальные элементы в ряду */}
          <div style={styles.radioRow}>
            <AnimatePresence>
              {windowStore.getResolutions
                .filter((res) => res[0] !== width)
                .map((res) => (
                  <ResolutionButton
                    key={`row-${res[0]}`}
                    res={res}
                    isSelected={false}
                    onClick={() => resizeWindow(res[0], res[1])}
                  />
                ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </motion.div>
  );
};

export default ResolutionsButtonsLayout;
