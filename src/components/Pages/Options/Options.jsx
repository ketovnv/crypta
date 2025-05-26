import React, { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { observer } from "mobx-react-lite";
import GradientSwitches from "./GradientSwitches";
import ResolutionsButtonsLayout from "./ResolutionsButtonsLayout";
import { gpuStore } from "@stores/gpuStore";
import { windowStore } from "@stores/window";
import { logger } from "@stores/logger";
import { router } from "@stores/router";
import SpringContent from "@animations/involved/SpringContent";
import Counter from "@animations/involved/Counter.jsx";
import time from "@stores/time.js";
import ScrollList from "@animations/involved/ScrollList";
import { Tabs } from "@animations/involved/Tabs";
import { uiStore } from "@stores/ui.js";
import { useTransform, motion } from "motion/react";

const Options = observer(() => {
  useEffect(() => {
    gpuStore.fetchMonitorModes();
  }, []);

  const tabs = [
    {
      title: "Темы",
      value: "product",
      content: (
        <animated.div
          className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900"
          style={{ ...uiStore.themeStyle }}
        >
          <GradientSwitches />
        </animated.div>
      ),
    },
    {
      title: "Разрешение",
      value: "resolutions",
      content: (
        <animated.div
          className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900"
          style={{ ...uiStore.themeStyle }}
        >
          <ResolutionsButtonsLayout
            width={windowStore.width}
            height={windowStore.height}
            mode={gpuStore.currentMode}
          />
        </animated.div>
      ),
    },
  ];
  // const x = useTransform(
  //   // unnnnnnnnnnnnnnnnnnnn.motionElapsedTime,
  //   (value) => (value / 1000) % 100,
  // ); // Пример

  return (
    <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
      <div className="relative flex flex-1 flex-col justify-between gap-3">
        <div className="h-[20rem] md:h-[40rem] [perspective:700px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40">
          <Tabs tabs={tabs} />
        </div>
        <SpringContent
          distance={150}
          direction="vertical"
          reverse={false}
          config={{ tension: 80, friction: 20 }}
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          display="flex"
        ></SpringContent>

        {router.isActiveOptions && (
          <SpringContent
            distance={150}
            direction="vertical"
            reverse={false}
            config={{ tension: 80, friction: 20 }}
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
            display="flex"
          >
            <motion.div style={{ x }} />
            ;
            <Counter
              places={[100, 10, 1]}
              fontSize={80}
              padding={5}
              gap={10}
              textColor="white"
              fontWeight={900}
            />
            {/*{*/}
            {/*  <ScrollList*/}
            {/*    // items={items}*/}
            {/*    onItemSelect={(item, index) => console.log(item, index)}*/}
            {/*    showGradients={true}*/}
            {/*    enableArrowNavigation={true}*/}
            {/*  />*/}
            {/*}*/}
          </SpringContent>
        )}
      </div>
    </div>
  );
});

export default Options;
{
  /*    <*/
}
{
  /*<ScrollArea h={100}>*/
}
{
  /*  <LJ label="dark" json={gradientStore.preparedDarkThemes} />*/
}
{
  /*  <LJ label="light" json={gradientStore.preparedDarkThemes} />*/
}
{
  /*</ScrollArea>*/
}
{
  /*<button onClick={() => gpuStore.toggleGpu()}>*/
}
{
  /*  GPU: {gpuStore.isGpuEnabled ? "ON" : "OFF"}*/
}
{
  /*</button>*/
}
{
  /*<div>*/
}
{
  /*<button*/
}
{
  /*  onClick={() => gpuStore.toggleBackground()}*/
}
{
  /*  style={{ marginLeft: 10 }}*/
}
{
  /*>*/
}
{
  /*  Background: {gpuStore.backgroundEnabled ? "ON" : "OFF"}*/
}
{
  /*</button>*/
}
{
  /*<button*/
}
{
  /*  onClick={() => gpuStore.fetchGpuInfo()}*/
}
{
  /*  style={{ marginLeft: 10 }}*/
}
{
  /*>*/
}
{
  /*  Refresh GPU Info*/
}
{
  /*</button>*/
}

{
  /*<p className="bg-clip-text bg-linear-to-r from-cyan-500 to-blue-500 w-fit font-black text-transparent text-4xl">*/
}
{
  /*  {" "}*/
}
{
  /*  Gradient text{" "}*/
}
{
  /*</p>*/
}

{
  /*<div>*/
}
{
  /*  <ul>*/
}
{
  /*    {gpuStore.modes.map(*/
}
{
  /*      (mode, index) =>*/
}
{
  /*        mode.refresh_rate === gpuStore.maxRefreshRate &&*/
}
{
  /*        resolutions.includes(mode.width + "x" + mode.height) && (*/
}
{
  /*          <li key={index}>*/
}
{
  /*            {mode.width}x{mode.height} @ {mode.refresh_rate}Hz{" "}*/
}
{
  /*            {mode.is_current && "(current)"}*/
}
{
  /*            <button*/
}
{
  /*              onClick={() => gpuStore.setResolution(mode)}*/
}
{
  /*              style={{ marginLeft: 10 }}*/
}
{
  /*            >*/
}
{
  /*              Apply*/
}
{
  /*            </button>*/
}
{
  /*          </li>*/
}
{
  /*        ),*/
}
{
  /*    )}*/
}
{
  /*  </ul>*/
}
{
  /*</div>*/
}

{
  /*<pre style={{ marginTop: 20 }}>*/
}
{
  /*  {JSON.stringify(gpuStore.gpuInfo, null, 2)}*/
}
{
  /*</pre>*/
}
{
  /*</div>*/
}
{
  /*    </div>*/
}
{
  /*<div className="p-4">*/
}
{
  /*<h1 className="font-bold text-xl">Monitor Modes</h1>*/
}
{
  /*{gpuStore.loading && <p>Loading...</p>}*/
}
{
  /*<ul>*/
}
{
  /*  {gpuStore.modes.map((mode, idx) => {*/
}
{
  /*    return (*/
}
{
  /*      mode.width > 2000 && (*/
}
{
  /*        <li key={idx}>*/
}
{
  /*          {mode.width}x{mode.height} @ {mode.refresh_rate}Hz{" "}*/
}
{
  /*          {mode.is_current && "(current)"}*/
}
{
  /*        </li>*/
}
{
  /*      )*/
}
{
  /*    );*/
}
{
  /*  })}*/
}
{
  /*</ul>*/
}
{
  /*</div>*/
}
{
  /*<AnimatePresence>*/
}
{
  /*{!monitors.length ?*/
}
{
  /*    <motion.div layout*/
}
{
  /*                animate={{*/
}
{
  /*                  width: 600,*/
}
{
  /*                  paddingLeft: 75,*/
}
{
  /*                  fontSize: '2em',*/
}
{
  /*                  color: uiStore.getRed*/
}
{
  /*                }}*/
}
{
  /*               className={classes.monitorError}*/
}
{
  /*                transition={{type: 'spring', visualDuration: 5, bounce: 0.5}}>*/
}
{
  /*      Монитор не доступен!*/
}
{
  /*    </motion.div>*/
}
{
  /*:*/
}
{
  /*    <motion.div*/
}
{
  /*        initial={{opacity: 0, y: -30}}*/
}
{
  /*        animate={{opacity: 1, y: 0}}*/
}
{
  /*        exit={{opacity: 0, y: 30}}*/
}
{
  /*        transition={{duration: 2}}*/
}
{
  /*    >*/
}
{
  /*      /!*<LJ json={uiStore.theme.background}/>*!/*/
}
{
  /*<ResolutionsButtons/>*/
}
{
  /*<motion.div*/
}
{
  /*    layout*/
}
{
  /*    animate={{opacity: 1, color: uiStore.theme.accentColor, width: '100%'}}*/
}
{
  /*    transition={{duration: 2}}*/
}
{
  /*    style={{*/
}
{
  /*      position: 'absolute',*/
}
{
  /*      fontSize: 14,*/
}
{
  /*      opacity: 0,*/
}
{
  /*      width: '95%'*/
}
{
  /*    }}>{`Размер монитора ${monitors[0].size.width} на ${monitors[0].size.height}`}*/
}
{
  /*  <motion.span*/
}
{
  /*      layout*/
}
{
  /*      animate={{width: '50%', color: uiStore.theme.color, right: -100, top: 0}}*/
}
{
  /*      transition={{duration: 5}}*/
}
{
  /*      style={{*/
}
{
  /*        position: 'absolute',*/
}
{
  /*        fontSize: 12,*/
}
{
  /*        width: '90%',*/
}
{
  /*        margin: 10,*/
}
{
  /*        marginTop: 2,*/
}
{
  /*        marginBottom: 5,*/
}
{
  /*        right: -200,*/
}
{
  /*        top: 50*/
}
{
  /*      }}>{`Масштаб (${monitors[0].scaleFactor})`}</motion.span>*/
}
{
  /*</motion.div>*/
}
{
  /*</motion.div>}*/
}
{
  /*</AnimatePresence>*/
}
