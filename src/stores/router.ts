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

const PAGE_SIZES = {
  Transactions: 0.8,
  Home: 1.6,
  Approve: 0.9,
  Balance: 0.8,
  Options: 1.2,
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
  currentPath: string = "Options";

  constructor() {
    makeAutoObservable(this);
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

  get getPageSizes() {
    return PAGE_SIZES;
  }

  get getPages() {
    return Object.entries(ROUTES);
  }

  getPageSize = (page) => {
    return PAGE_SIZES[page] * uiStore.screenSize.width * RESOLUTION_SCALER;
  };

  getPageComponent = (route: string) => PAGE_COMPONENTS[route];

  @action
  goTo(path: string) {
    if (this.currentPath === path) return;
    this.currentPath = path;
    // logger.logJSON('pages:',JSON.stringify(this.getPages))
  }
}

export const router = new RouterStore();
