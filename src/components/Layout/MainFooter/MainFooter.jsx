import {AppShell} from '@mantine/core'
import {observer} from 'mobx-react-lite' // import classes from "./MainFooter.module.css";
import {motion} from 'motion/react'
import {router} from '@stores/router'
import React from 'react'
import GradientText from '@animations/involved/GradientText.jsx'
import {Bun} from '@components/Layout/SvgIcons/Bun'

export const MainFooter = observer(() => {
  return (
    <AppShell.Footer
      style={{
          border: 'none',
          background: 'rgb(0, 0, 0, 0)'
      }}
    >
      <motion.div
          layout

        initial={{
            y: -75,
            x: -50
        }}
        animate={{
            width: '110%',
            y: 0,
            x: 0
        }}
          transition={{
              type: 'spring',
              visualDuration: 3,
              bounce: 0.3
        }}
      >
          {router.footerLinks.map((link, index) => (
              <motion.a
                  key={link[0]}
                  layout
                  transition={{
                      type: 'spring',
                      visualDuration: 3,
                      delay: index / 2
                  }}
                  style={{fontFamily: 'SF Pro Rounded'}}
                  initial={{
                      padding: 0,
                      opacity: 0
                  }}
                  animate={{
                      padding: 20,
                      opacity: 1
                  }}
                  href={link[1]}
                  target='_blank'
              >
            <span>
              {/*{link[0] === 'Bun' && <Bun/>}*/}
                <GradientText animationDuration={6} colors={["#1009DD", "#55CCCC", "#1050CC", "#99FFFF", "#1050CC"]} fontWeight={700}>{link[0]}</GradientText>
            </span>
              </motion.a>
          ))}
      </motion.div>
    </AppShell.Footer>
  )
})
