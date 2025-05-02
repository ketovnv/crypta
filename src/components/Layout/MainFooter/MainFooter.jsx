import {AppShell} from '@mantine/core'
import {observer} from 'mobx-react-lite' // import classes from "./MainFooter.module.css";
import {motion} from 'motion/react'
import {router} from '@stores/router'
import React from 'react'
import GradientText from '@animations/involved/GradientText.jsx'
import {Bun} from "../SvgIcons/Bun"
import {ReactSVG} from "../SvgIcons/ReactSVG"
import {uiStore} from "@stores/ui.js";
import {animation} from "@stores/animation.js";
import {gradientStore} from "@stores/gradient.js";

// Стили для контента

export const MainFooter = observer(() => {

    const marqueeVariants = {
        animate: {
            x: [-1, '-100vw'], // Зависит от общей ширины контента
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 95, // Медленное движение
                    ease: "linear"
                }
            }
        }
    };



  return (
    <AppShell.Footer
      style={{
          border: 'none',
          background: 'rgb(0, 0, 0, 0)',
          // width: '100%',
          // overflow: 'hidden',
          // padding: '20px 0',
          // position: 'relative'
      }}
    >
      <motion.div
          layout
          variants={marqueeVariants}
          style={{
              display: 'flex',
              gap: '24px',
              alignItems: 'center'
          }}

          animate="animate"

      >
          {[...router.footerLinks, ...router.footerLinks,].map((link, index) => (
              <motion.a
                  key={link[0] + index + link[1]}
                  layout
                  whileHover="hover"
                  whileTap={{
                      scale: 0.95,
                      transition: {duration: 0.2}
                  }}
                  transition={{
                      type: 'spring',
                      visualDuration: 5,
                      bounce: 0.7,
                      delay: index / 2
                  }}
                  style={{fontFamily: 'SF Pro Rounded'}}
                  initial={{
                      filter: 'blur(2px)',
                      padding: 0,
                      opacity: 0
                  }}
                  variants={{'hover': {scale: 1.5, padding: 20, opacity: 1}}}
                  animate={{
                      filter: 'blur(0px)',
                      padding: 20,
                      opacity: 1,
                  }}
                  href={link[1]}
                  target='_blank'
              >
                  {<GradientText animationDuration={6}
                                 colors={link[0] !== 'ChromaJS'
                                     ? animation.theme.navBarButtonText
                                     : gradientStore.getRainbowV2Gradient}
                                 fontWeight={700}>
                      {link[0] === 'Bun' && <Bun scale={2} key="bun"/>}
                      {link[0] === 'React' && <ReactSVG scale={2} key="react" isDark={uiStore.themeIsDark}/>}
                      {!['Bun', 'React'].includes(link[0]) &&
                          <span style={{minWidth: link[0].length * 15}}>{link[0]}</span>}
                  </GradientText>}
              </motion.a>
          ))}
      </motion.div>
    </AppShell.Footer>
  )
})
