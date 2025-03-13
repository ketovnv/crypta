import { action, makeAutoObservable } from "mobx";
import React, { Suspense } from "react";
// @ts-ignore
import { ROUTE_URLS, ROUTES_LAZY } from "@components/pages/routes";
import { loggerStore } from "./logger";

class RouterStore {
  currentPath: string = "/";
  previousComponent: React.ReactNode | null = null;
  isTransitioning: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  goTo(path: string, options?: { delay?: number }) {
    const { delay = 500 } = options || {};

    if (this.currentPath === path) return;

    this.isTransitioning = true;
    const CurrentComponent = ROUTES_LAZY[this.currentPath]?.element;
    this.previousComponent = CurrentComponent ?? null;

    setTimeout(
      action(() => {
        this.currentPath = path;
        this.isTransitioning = false;
        this.previousComponent = null;
      }),
      delay,
    );
  }

  getComponent = () => {
    const Component = ROUTES_LAZY[ROUTE_URLS[this.currentPath]]?.element;
    loggerStore.logWhiteRandom("Component", Component);
    return (
        <Suspense fallback={<div>Загрузка...</div>}>
          {Component ? <Component /> : null}
        </Suspense>
    );
  };


  getComponent = () => {
    const Component = ROUTES_LAZY[ROUTE_URLS[this.currentPath]]?.element;
    loggerStore.logWhiteRandom("Component", Component);
    return (
      <Suspense fallback={<div>Загрузка...</div>}>
        {Component ? <Component /> : null}
      </Suspense>
    );
  };

  async preloadPage(path: string) {
    if (ROUTES_LAZY[ROUTE_URLS[path]]) {
      await ROUTES_LAZY[ROUTE_URLS[path]].element();
    }
  }
}

export const routerStore = new RouterStore();
