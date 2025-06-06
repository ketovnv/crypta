import {motion, MotionConfig} from "motion/react";

export function Bun({scale = 1, props}) {
  return (
      <MotionConfig transition={{
        repeat: Infinity,
        repeatType: "reverse",
          type: 'spring',
          stiffness: 300,
          friction: 100,
          mass: 10,
          damping: 150,
      }}>
        <motion.svg
            layout
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 32 32'

            initial={{scale: 2, width: 10, height: 10}}
            animate={{scale: 5}}
      {...props}
    >
          <motion.path
              initial={{fill: 'hsl(55 90% 65%)'}}
              animate={{fill: 'hsl(42.6 100% 100%)'}}
        d='M29 17c0 5.65-5.82 10.23-13 10.23S3 22.61 3 17c0-3.5 2.24-6.6 5.66-8.44S14.21 4.81 16 4.81s3.32 1.54 7.34 3.71C26.76 10.36 29 13.46 29 17'
          ></motion.path>
          <motion.path
        fill='none'
        initial={{stroke: 'oklch(0.3  0.1  110)'}}
        animate={{stroke: 'oklch(0.03 0.2  99.1)'}}

        d='M16 27.65c7.32 0 13.46-4.65 13.46-10.65c0-3.72-2.37-7-5.89-8.85c-1.39-.75-2.46-1.41-3.37-2l-1.13-.69A6.14 6.14 0 0 0 16 4.35a6.9 6.9 0 0 0-3.3 1.23c-.42.24-.86.51-1.32.8c-.87.54-1.83 1.13-3 1.73C4.91 10 2.54 13.24 2.54 17c0 6 6.14 10.65 13.46 10.65Z'
          ></motion.path>
      <ellipse
        cx='21.65'
        cy='18.62'
        fill='#febbd0'
        rx='2.17'
        ry='1.28'
      ></ellipse>
      <ellipse
        cx='10.41'
        cy='18.62'
        fill='#febbd0'
        rx='2.17'
        ry='1.28'
      ></ellipse>
      <path
        fillRule='evenodd'
        d='M11.43 18.11a2 2 0 1 0-2-2.05a2.05 2.05 0 0 0 2 2.05m9.2 0a2 2 0 1 0-2-2.05a2 2 0 0 0 2 2.05'
      ></path>
      <path
        fill='#fff'
        fillRule='evenodd'
        d='M10.79 16.19a.77.77 0 1 0-.76-.77a.76.76 0 0 0 .76.77m9.2 0a.77.77 0 1 0 0-1.53a.77.77 0 0 0 0 1.53'
      ></path>
      <path
        fill='#b71422'
        stroke='#000'
        strokeWidth='.75'
        d='M18.62 19.67a3.3 3.3 0 0 1-1.09 1.75a2.48 2.48 0 0 1-1.5.69a2.53 2.53 0 0 1-1.5-.69a3.28 3.28 0 0 1-1.08-1.75a.26.26 0 0 1 .29-.3h4.58a.27.27 0 0 1 .3.3Z'
      ></path>
      <path
        fill='#ccbea7'
        fillRule='evenodd'
        d='M14.93 5.75a6.1 6.1 0 0 1-2.09 4.62c-.1.09 0 .27.11.22c1.25-.49 2.94-1.94 2.23-4.88c-.03-.15-.25-.11-.25.04m.85 0a6 6 0 0 1 .57 5c0 .13.12.24.21.13c.83-1 1.54-3.11-.59-5.31c-.1-.11-.27.04-.19.17Zm1-.06a6.1 6.1 0 0 1 2.53 4.38c0 .14.21.17.24 0c.34-1.3.15-3.51-2.66-4.66c-.12-.02-.21.18-.09.27ZM9.94 9.55a6.27 6.27 0 0 0 3.89-3.33c.07-.13.28-.08.25.07c-.64 3-2.79 3.59-4.13 3.51c-.14-.01-.14-.21-.01-.25'
      ></path>
        </motion.svg>
      </MotionConfig>
  )
}
