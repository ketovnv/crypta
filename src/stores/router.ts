import { action, makeAutoObservable } from "mobx";
import React from "react";

import { ANIMATION_DURATION } from "./animation";
// @ts-ignore

const ROUTES = {
  "/": {
    title: "Кошелёк",
    element: "Home",
    animation: "fade",
    animationDuration: ANIMATION_DURATION.LONG, // Замените на реальные значения
  },
  "/balance": {
    title: "Баланс",
    element: "Balance",
    animation: "slide-up",
    animationDuration: ANIMATION_DURATION.LONG,
  },
  "/approve": {
    title: "Одобрение",
    element: "Approve",
    animation: "slide-down",
    animationDuration: ANIMATION_DURATION.LONG,
  },
  "/transactions": {
    title: "Транзакции",
    element: "Transactions",
    animation: "slide-left",
    animationDuration: ANIMATION_DURATION.LONG,
  },
  "/options": {
    title: "Настройки",
    element: "Options",
    animation: "fade",
  },
};

class RouterStore {
  currentPath: string = "/";
  previousComponent: React.ReactNode | null = null;
  isTransitioning: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  get getPageElement() {
    return ROUTES[this.currentPath].element;
  }

  @action
  goTo(path: string, options?: { delay?: number }) {
    const { delay = 500 } = options || {};
    if (this.currentPath === path) return;
    this.currentPath = path;
    // this.isTransitioning = true;
    // const CurrentComponent = ROUTES[this.currentPath]?.element;
    // this.previousComponent = CurrentComponent ?? null;
    //
    // setTimeout(
    //   action(() => {
    //     this.currentPath = path;
    //     this.isTransitioning = false;
    //     this.previousComponent = null;
    //   }),
    //   delay
    // );
  }

  getPages = () => Object.entries(ROUTES);

  async preloadPage() {
    if (ROUTES[this.currentPath]) {
      await ROUTES[this.currentPath].element();
    }
  }
}

export const router = new RouterStore();
