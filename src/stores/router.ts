import { action, makeAutoObservable } from "mobx";
import React from "react";
import { uiStore } from "./ui";

const ROUTES = {
  Transactions: "Etherscan",
  Home: "Кошелёк",
  Approve: "Одобрение",
  Balance: "Баланс",
  Options: "Настройки",
};

const RESOLUTION_SCALER = 1 / 1707;

const PAGE_SIZES_PRESSES_WRAPPERS = {
  Transactions: [0.8, 1, true],
  Home: [1.6, 1, true],
  Approve: [0.9, 1, true],
  Balance: [0.8, 1, true],
  Options: [1.2, 1, false],
};

export const PAGE_COMPONENTS = {
  Home: React.lazy(() => import("../components/pages/Home/Home.jsx")),
  Balance: React.lazy(() => import("../components/pages/Balance/Balance")),
  Approve: React.lazy(() => import("../components/pages/Approve/Approve")),
  Transactions: React.lazy(
    () => import("../components/pages/Transactions/Transactions"),
  ),
  Options: React.lazy(() => import("../components/pages/Options/Options")),
};

const FOOTER_LINKS = [
  ["Tron", "developers.tron.network"],
  ["Reown", "https://react.dev/"],
  ["Etherscan", "https://etherscan.io/"],
  ["USDT", "https://tether.to/"],
  ["Spring", "https://react-spring.dev/"],
  ["React", "https://react.dev/"],
  ["Motion", "https://motion.dev/docs/react-animation"],
  ["Vite", "chroma-js"],
  ["ChromaJS", "https://www.vis4.net/chromajs/"],
  ["MobX", "https://mobx.js.org/"],
  ["Tailwindcss", "https://www.tailwindcss.com"],
  ["Tauri", "https://v2.tauri.app/start/"],
  ["Bun", "https://bun.sh/"],
];

class RouterStore {
  currentPath: string = "Home";

  constructor() {
    makeAutoObservable(this, {
      goTo: action,
    });
  }

  get isActiveEtherium() {
    return this.currentPath === "Transactions";
  }

  get isActiveOptions() {
    return this.currentPath === "Options";
  }

  get getCurrentPage() {
    return this.currentPath;
  }

  get footerLinks() {
    return FOOTER_LINKS;
  }

  get getPages() {
    return Object.entries(ROUTES);
  }

  get getCurrentPageMeta() {
    const meta = PAGE_SIZES_PRESSES_WRAPPERS[this.currentPath];
    return [
      meta[0] * uiStore.screenSize.width * RESOLUTION_SCALER,
      meta[1],
      meta[2],
    ];
  }

  get getCurrentPageComponent() {
    return PAGE_COMPONENTS[this.currentPath], this.getCurrentPageMeta;
  }

  // @
  goTo(path: string) {
    if (this.currentPath === path) return;
    this.currentPath = path;
    // logger.logJSON('pages:',JSON.stringify(this.getPages))
  }
}

export const router = new RouterStore();
