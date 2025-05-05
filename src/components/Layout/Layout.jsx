import {AppShell, MantineProvider} from '@mantine/core'
import {motion} from 'motion/react'
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

const Layout = observer(() => {
  useEffect(() => {
      document.body.setAttribute('data-motion-debug', 'true')
    console.log('Layout mounted')
    // logger.info("🍰", " Layout mounted");
    return () => console.log('Layout unmounted')
  }, [])
  console.log('LAYOUT')

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
          <MainHeader />
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
