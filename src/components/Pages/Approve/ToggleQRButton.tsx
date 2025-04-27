import { motion } from 'framer-motion'

interface ToggleButtonProps {
  qrType: 'walletconnect' | 'erc681'
  onToggle: () => void
}

export function ToggleQRButton({ qrType, onToggle }: ToggleButtonProps) {
  return (
      <motion.button
          whileHover={{ scale: 1.1, rotate: [0, 2, -2, 2, 0] }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onClick={onToggle}
          className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md focus:outline-none focus:ring focus:ring-blue-300"
      >
        {qrType === 'walletconnect' ? 'Switch to ERC681' : 'Switch to WalletConnect'}
      </motion.button>
  )
}
