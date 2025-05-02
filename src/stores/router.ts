import { action, makeAutoObservable } from 'mobx'
import React from "react";

const ROUTES = {
  Transactions: 'Etherscan',
  Home: 'Кошелёк',
  Approve: 'Одобрение',
  Balance: 'Баланс',
  Options: 'Настройки'
}

 export const PAGE_COMPONENTS = {
  Home: React.lazy(() => import('../components/pages/Home/Home.jsx')),
  Balance: React.lazy(() => import('../components/pages/Balance/Balance')),
  Approve: React.lazy(() => import('../components/pages/Approve/Approve')),
  Transactions: React.lazy(() => import('../components/pages/Transactions/Transactions')),
  Options: React.lazy(() => import('../components/pages/Options/Options'))
};

const FOOTER_LINKS = [
  ['Reown', 'https://react.dev/'],
  // ['Networks', 'https://ethereum.org/en/developers/docs/networks/'],
  // ['RPC сети', 'https://eth.merkle.io/'],
  ['Etherscan', 'https://etherscan.io/'],
  // ['Etherscan API', 'https://api.etherscan.io/api'],
  ['React', 'https://react.dev/'],
  ['Spring', 'https://react-spring.dev/'],
  ['Motion', 'https://motion.dev/docs/react-animation'],
  ['Mantine UI', 'https://mantine.dev/about/'],
  ['Tauri', 'https://v2.tauri.app/start/'],
  ['Bun', 'https://bun.sh/'],
  ['MobX', 'https://mobx.js.org/'],
  ['ChromaJS', 'https://www.vis4.net/chromajs/'],
  ['Vite', 'chroma-js']
]
class RouterStore {
  currentPath: string = 'Options'

  constructor () {
    makeAutoObservable(this)
  }


  get isActiveEtherium () {
    return this.currentPath === 'Transactions'
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


  getPageComponent = (route:string) =>PAGE_COMPONENTS[route]

  @action
  goTo (path: string) {
    if (this.currentPath === path) return
    this.currentPath = path
    // logger.logJSON('pages:',JSON.stringify(this.getPages))
  }
}

export const router = new RouterStore()
