import {motion} from 'framer-motion'
// @ts-ignore
import classes from './ToggleQRButton.module.css'

interface ToggleButtonProps {
  qrType: 'walletconnect' | 'erc681'
    onToggle: () => void,
    navBarButtonBackground: string,
    color: string,
    accentColor: string
}


export function ToggleQRButton({qrType, onToggle, navBarButtonBackground, color, accentColor}: ToggleButtonProps) {
  return (
      <motion.div layout
                  style={{
                      width: '95%',
                      display: 'flex',
                      justifyContent: qrType === 'walletconnect' ? 'flex-start' : 'flex-end'
                  }}
      >
          <div className={classes.beforeButton}>
              <motion.button
                  className={classes.typeButton}
                  layout
                  animate={{width: 'fit-content', background:navBarButtonBackground, color:accentColor, borderColor: color,opacity:[0,0,1]}}
                  whileHover={{scale: 1.05, borderRadius: 10 ,color}}
                  whileTap={{scale: 0.97}}
                  transition={{
                      duration: 0.7, ease: 'easeInOut',
                      background: {type: 'spring', visualDuration: 3, bounce: 0.1},
                      color: {type: 'spring', visualDuration: 5, bounce: 0.1},
                  }}
                  onClick={onToggle}
              >
                  {qrType === 'walletconnect' ? 'Переключить на формат ERC681' : 'Переключить на формат WalletConnect'}
              </motion.button>
          </div>
      </motion.div>
  )
}
