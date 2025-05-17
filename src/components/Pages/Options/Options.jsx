/**/ import React, { useEffect, useState } from 'react'
import { animated } from '@react-spring/web'
import { AnimatePresence, motion } from 'motion/react'
import { observer } from 'mobx-react-lite'
import { uiStore } from '@stores/ui.js'
import { animation } from '@stores/animation.js'
import GradientSwitches from './GradientSwitches'
import ResolutionsButtonsLayout from './ResolutionsButtonsLayout'
import classes from './Options.module.css'
import { gpuStore } from '@stores/gpuStore.js'
import {windowStore} from "@stores/window.js";


const Options = observer(() => {
  const [resolution, setResolution] = useState(
    () => localStorage.getItem('resolution') || '1280x720'
  )

  useEffect(() => {
    gpuStore.fetchMonitorModes()
  }, [])




  const resolutions = [
    '800x600',
    '1024x768',
    '1920x1080',
    '2560x1440'
  ]
  return (
    <main className='pageWrapper'>
      <animated.section className='pageCard' style={uiStore.themeStyle}>


        {gpuStore.currentMode&&<ResolutionsButtonsLayout width={windowStore.width} height={windowStore.height} mode={gpuStore.currentMode} />}
        <GradientSwitches />

        <button onClick={() => gpuStore.toggleGpu()}>
          GPU: {gpuStore.isGpuEnabled ? 'ON' : 'OFF'}
        </button>
        <p className='bg-clip-text bg-gradient-to-r from-primary to-error w-fit font-black text-transparent text-4xl'>
          {' '}
          Gradient text{' '}
        </p>
        <div>
          <button
            onClick={() => gpuStore.toggleBackground()}
            style={{ marginLeft: 10 }}
          >
            Background: {gpuStore.backgroundEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => gpuStore.fetchGpuInfo()}
            style={{ marginLeft: 10 }}
          >
            Refresh GPU Info
          </button>

          <p className='bg-clip-text bg-linear-to-r from-cyan-500 to-blue-500 w-fit font-black text-transparent text-4xl'>
            {' '}
            Gradient text{' '}
          </p>

          <div>
            <ul>
              {gpuStore.modes.map(
                (mode, index) =>
                  mode.refresh_rate === gpuStore.maxRefreshRate &&
                  resolutions.includes(mode.width + 'x' + mode.height) && (
                    <li key={index}>
                      {mode.width}x{mode.height} @ {mode.refresh_rate}Hz{' '}
                      {mode.is_current && '(current)'}
                      <button
                        onClick={() => gpuStore.setResolution(mode)}
                        style={{ marginLeft: 10 }}
                      >
                        Apply
                      </button>
                    </li>
                  )
              )}
            </ul>
          </div>

          <pre style={{ marginTop: 20 }}>
            {JSON.stringify(gpuStore.gpuInfo, null, 2)}
          </pre>
        </div>

        <div className='p-4'>
          <h1 className='font-bold text-xl'>Monitor Modes</h1>
          {gpuStore.loading && <p>Loading...</p>}
          <ul>
            {gpuStore.modes.map(
              (mode, idx) =>{
                return mode.width > 2000 && (
                  <li key={idx}>
                    {mode.width}x{mode.height} @ {mode.refresh_rate}Hz{' '}
                    {mode.is_current && '(current)'}
                  </li>
                )
            })}
          </ul>
        </div>
        {/*<AnimatePresence>*/}
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

        {/*</AnimatePresence>*/}
      </animated.section>
    </main>
  )
})

export default Options
