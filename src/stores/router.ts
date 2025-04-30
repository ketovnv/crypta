import { action, makeAutoObservable } from 'mobx'
import { logger } from './logger'

const ROUTES = {
  Home: 'Кошелёк',
  Balance: 'Баланс',
  Approve: 'Одобрение',
  Transactions: 'Etherscan',
  Options: 'Настройки'
}

const FOOTER_LINKS = [
  ['Reown', 'https://react.dev/'],
  ['Networks', 'https://ethereum.org/en/developers/docs/networks/'],
  ['RPC сети', 'https://eth.merkle.io/'],
  ['Etherscan', 'https://etherscan.io/'],
  ['Etherscan API', 'https://api.etherscan.io/api'],
  ['React', 'https://react.dev/'],
  ['Spring', 'https://react-spring.dev/'],
  ['Motion', 'https://motion.dev/docs/react-animation'],
  ['Mantine UI', 'https://mantine.dev/about/'],
  ['Bun', 'https://bun.sh/'],
  ['Tauri', 'https://v2.tauri.app/start/'],
  ['MobX', 'https://mobx.js.org/'],
  ['ChromaJS', 'https://www.vis4.net/chromajs/'],
  ['Vite', 'chroma-js']
]

class RouterStore {
  currentPath: string = 'Approve'

  constructor () {
    makeAutoObservable(this)
  }

  get getCurrentPage () {
    return this.currentPath
  }

  get footerLinks () {
    return FOOTER_LINKS
  }

  get getPages () {
    return Object.entries(ROUTES)
  }

  @action
  goTo (path: string) {
    if (this.currentPath === path) return
    this.currentPath = path
    // logger.logJSON('pages:',JSON.stringify(this.getPages))
  }
}

export const router = new RouterStore()
