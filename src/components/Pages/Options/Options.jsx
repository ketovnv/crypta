import React, {useEffect, useState} from "react";
import {animated} from "@react-spring/web";
import {AnimatePresence, motion} from "motion/react";
import {observer} from "mobx-react-lite";
import {uiStore} from "@stores/ui.js";
// import { Webview,
//   getCurrentWebview,
//   getAllWebviews } from '@tauri-apps/api/webview'
// import {   WebviewWindow, getCurrentWebviewWindow, getAllWebviewWindows  } from '@tauri-apps/api/webviewWindow'
// import {
//   app, core, dpi, event, image, menu, mocks, path, tray, webview, webviewWindow, window
// } from '@tauri-apps/api';
//
// import {
//   Window,
//   CloseRequestedEvent,
//   getCurrentWindow,
//   getAllWindows,
//   LogicalSize,
//   PhysicalSize,
//   LogicalPosition,
//   PhysicalPosition,
//   UserAttentionType,
//   Effect,
//   EffectState,
//   currentMonitor,
//   monitorFromPoint,
//   primaryMonitor,
//   availableMonitors,
//   cursorPosition
// } from '@tauri-apps/api/window';
import {availableMonitors, getCurrentWindow, LogicalPosition, LogicalSize} from '@tauri-apps/api/window';
import {WebviewWindow} from '@tauri-apps/api/webviewWindow';
import {logger} from "@stores/logger.js";
import {animation} from "@stores/animation.js";
import GradientSwitches from "./GradientSwitches";
// import ResolutionsButtons from "./ResolutionsButtons";
import ResolutionsButtonsLayout from "./ResolutionsButtonsLayout";
import classes from "./Options.module.css";
import ResolutionsButtons from "./ResolutionsButtons.jsx";


const Options = observer(() => {

  const [resolution, setResolution] = useState(() => localStorage.getItem('resolution') || '1280x720');
  const [fullscreen, setFullscreenState] = useState(() => localStorage.getItem('fullscreen') === 'true');
  const [monitors, setMonitors] = useState([]);
  const [selectedMonitor, setSelectedMonitor] = useState(() => parseInt(localStorage.getItem('selectedMonitor')) || 0);

  useEffect(() => {
    if (!monitors.length) {
      logger.logRandomColors('availableMonitors', 123)
      availableMonitors().then(setMonitors);
    }
  }, []);

  async function resizeWindow(width, height) {
    try {
      const appWindow = WebviewWindow.getCurrent();
      await appWindow.setSize({width, height});

      // Центрирование окна после изменения размера
      await appWindow.center();

      console.log(`Размер окна изменен на ${width}x${height}`);
      return true;
    } catch (error) {
      console.error("Ошибка при изменении размера окна:", error);
      return false;
    }
  }

  const applySettings = async () => {


    const appWindow = WebviewWindow.getCurrent();

    const size = await appWindow.outerSize();
    console.log("Текущий размер окна:", size);
    const win = await getCurrentWindow();
    const [width, height] = resolution.split('x').map(Number);

    localStorage.setItem('resolution', resolution);
    localStorage.setItem('fullscreen', fullscreen);
    localStorage.setItem('selectedMonitor', selectedMonitor);

    // await win.setFullscreen(fullscreen);

    // if (!fullscreen) {

    await win.setSize(new LogicalSize(width, height));
    logger.logRandomColors(width, height)
    logger.logRandomColors(width, height)

    if (monitors[selectedMonitor]) {
      await win.setPosition(new LogicalPosition(monitors[selectedMonitor].position));
    }
  };

  async function getMonitorsInfo() {
    try {
      // Получение списка всех мониторов
      const allMonitors = await Monitor.getAll();
      console.log("Все мониторы:", allMonitors);

      // Получение основного монитора
      const primaryMonitor = await Monitor.getPrimary();
      console.log("Основной монитор:", primaryMonitor);

      return {allMonitors, primaryMonitor};
    } catch (error) {
      console.error("Ошибка при получении информации о мониторах:", error);
      return null;
    }
  }

// Адаптация окна к размеру экрана
  async function adaptWindowToScreen() {
    try {
      const appWindow = WebviewWindow.getCurrent();
      const primaryMonitor = await Monitor.getPrimary();

      if (primaryMonitor) {
        // Получение размера монитора
        const {width: screenWidth, height: screenHeight} = primaryMonitor.size;

        // Расчет оптимального размера (например, 80% от размера экрана)
        const optimalWidth = Math.round(screenWidth * 0.8);
        const optimalHeight = Math.round(screenHeight * 0.8);

        // Применение размера
        await appWindow.setSize({width: optimalWidth, height: optimalHeight});

        // Центрирование окна
        await appWindow.center();

        console.log(`Окно адаптировано к размеру экрана: ${optimalWidth}x${optimalHeight}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Ошибка при адаптации окна:", error);
      return false;
    }
  }

  return (
    <main className="pageWrapper">
      <animated.section className="pageCard" style={uiStore.themeStyle}>
        <AnimatePresence>
          <
            GradientSwitches/>
          {/*{!monitors.length ?*/}
          {/*    <motion.div layout*/}
          {/*                animate={{*/}
          {/*                  width: 600,*/}
          {/*                  paddingLeft: 75,*/}
          {/*                  fontSize: '2em',*/}
          {/*                  color: uiStore.getRed*/}
          {/*                }}*/}
          {/*               className={classes.monitorError}*/}
          {/*                transition={{type: 'spring', visualDuration: 5, bounce: 0.5}}>*/}
          {/*      Монитор не доступен!*/}
          {/*    </motion.div>*/}
          {/*:*/}

          {/*    <motion.div*/}
          {/*        initial={{opacity: 0, y: -30}}*/}
          {/*        animate={{opacity: 1, y: 0}}*/}
          {/*        exit={{opacity: 0, y: 30}}*/}
          {/*        transition={{duration: 2}}*/}
          {/*    >*/}
          {/*      /!*<LJ json={animation.theme.background}/>*!/*/}
                <ResolutionsButtonsLayout/>
                {/*<ResolutionsButtons/>*/}
                {/*<motion.div*/}
                {/*    layout*/}
                {/*    animate={{opacity: 1, color: animation.theme.accentColor, width: '100%'}}*/}
                {/*    transition={{duration: 2}}*/}
                {/*    style={{*/}
                {/*      position: 'absolute',*/}
                {/*      fontSize: 14,*/}
                {/*      opacity: 0,*/}
                {/*      width: '95%'*/}
                {/*    }}>{`Размер монитора ${monitors[0].size.width} на ${monitors[0].size.height}`}*/}
                {/*  <motion.span*/}
                {/*      layout*/}
                {/*      animate={{width: '50%', color: animation.theme.color, right: -100, top: 0}}*/}
                {/*      transition={{duration: 5}}*/}
                {/*      style={{*/}
                {/*        position: 'absolute',*/}
                {/*        fontSize: 12,*/}
                {/*        width: '90%',*/}
                {/*        margin: 10,*/}
                {/*        marginTop: 2,*/}
                {/*        marginBottom: 5,*/}
                {/*        right: -200,*/}
                {/*        top: 50*/}
                {/*      }}>{`Масштаб (${monitors[0].scaleFactor})`}</motion.span>*/}
                {/*</motion.div>*/}
              {/*</motion.div>}*/}
        </AnimatePresence>
      </animated.section>
    </main>)

})


export default Options;
