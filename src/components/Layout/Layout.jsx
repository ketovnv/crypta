import {AppShell, MantineProvider} from '@mantine/core'
import {motion,AnimatePresence} from 'motion/react'
import React, {useEffect} from 'react'
import {MainNavbar} from './MainNavbar'
import {MainHeader} from './MainHeader'
import {MainFooter} from './MainFooter'
import {logger} from '@/stores/logger.js'
import {eventsStore} from '@/stores/events'
import {AppKitObserver} from './AppKitObserver'
import {MainContent} from '@components/Layout/MainContent/index.js'
import {AnimationObserver} from '@animations/involved/AnimationObserver.jsx'
import {observer} from 'mobx-react-lite'
import {ErrorBoundary} from "@components/pages/ErrorNotification/ErrorBoundary.jsx";
import {uiStore} from "@stores/ui.js";
import HeaderBitcoin from "@components/Layout/SvgIcons/HeaderBitcoin.jsx";

const Layout = observer(() => {
  useEffect(() => {
      document.body.setAttribute('data-motion-debug', 'true')
    // console.log('Layout mounted')
    // logger.info("🍰", " Layout mounted");
    return () => console.log('Layout unmounted')
  }, [])
  // console.log('LAYOUT')

  logger.logRandomColors('LAYOUT', 'mounted', 12)
  return (
      <ErrorBoundary>
          <MantineProvider>
      {/*<span>{JSON.stringify(eventsStore.state)}</span>*/}

      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm'
        }}
        style={{
          // scale:0.8,
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100vw',
          overflow: 'hidden'
        }}
        padding={0}
      >
        <AppKitObserver />
          <AnimationObserver/>
          <motion.div
          animate={{
            opacity: eventsStore.state?.open ? 0.05 : 1,
            filter: eventsStore.state?.open ? 'blur(2px)' : 'blur(0px)'
          }}
          transition={{ duration: 1.5 }}
        >
              <AnimatePresence>
                  {uiStore.isNavbarOpened ?
                      <motion.div key={uiStore.isNavbarOpened} style={{position: 'absolute', top: 10, left: 10, zIndex: 9999, cursor: 'pointer'}}
                      initial={{scale:0}} animate={{ scale: 1}} exit={{scale: 0,y:-50}} transition={{duration: 1}}
                                  whileHover="hover"
                                  whileTap={{scale: 0.5, transition: {duration: 0.2}}}
                      >
                          <HeaderBitcoin toggleNavbarOpened={uiStore.toggleNavbarOpened} isDark={uiStore.themeIsDark}/>
                      </motion.div> :
                      <MainHeader/>}
              </AnimatePresence>
          <MainNavbar />
          <MainContent />
        </motion.div>
        <MainFooter />
      </AppShell>
    </MantineProvider>
      </ErrorBoundary>
  )
})

export default Layout
