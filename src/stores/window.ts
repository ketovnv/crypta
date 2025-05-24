// src/stores/WindowManagerStore.ts
import { makeAutoObservable, runInAction } from "mobx";
import {
  getCurrentWindow,
  LogicalPosition,
  LogicalSize,
} from "@tauri-apps/api/window";
import { gpuStore } from "./gpuStore.ts";
import { logger } from "./logger";

const RESOLUTIONS = [
  [1024, 768],
  [1707, 960],
  [1920, 1080],
  [2560, 1440],
];

export class WindowStore {
  currentWindow = null;
  width = 800;
  height = 600;
  x = 100;
  y = 100;
  isFullscreen = false;
  isAlwaysOnTop = false;
  unlistenWindow = null;

  constructor() {
    makeAutoObservable(this);
    this.init().then(() => console.log("Window inited"));
  }

  get getResolutions() {
    return RESOLUTIONS.filter((res) => res[0] <= gpuStore.currentMode?.width);
  }

  async init() {
    runInAction(() => {
      this.currentWindow = getCurrentWindow();
    });
    const size = await this.currentWindow.innerSize();
    const pos = await this.currentWindow.outerPosition();
    const fs = await this.currentWindow.isFullscreen();
    const top = await this.currentWindow.isAlwaysOnTop();
    const factor = await getCurrentWindow().scaleFactor();
    logger.success("factor", factor);
    // const unlisten = await getCurrentWindow().onResized(({ payload: size }) => {
    // logger.logJSON(size.type, size.toJSON());
    // logger.logJSON("Logical", size.toLogical(factor));
    // logger.logJSON('Window resized', size);
    // });

    runInAction(() => {
      this.width = size.width;
      this.height = size.height;
      this.x = pos.x;
      this.y = pos.y;
      this.isFullscreen = fs;
      this.isAlwaysOnTop = top;
      // this.unlistenWindow = unlisten;
    });
  }

  async applySize(w: number, h: number) {
    if (w === this.width && h === this.height) return;
    this.width = w;
    this.height = h;
    const resp = await this.currentWindow.setSize(new LogicalSize(w, h));
    await getCurrentWindow().setFullscreen(true);
    console.warn(resp);
    return true;
  }

  // setPosition(x: number, y: number) {
  //   this.x = x;
  //   this.y = y;
  //   this.currentWindow.setPosition(new LogicalPosition(x, y));
  // }
  //
  // async toggleFullscreen() {
  //   this.isFullscreen = !this.isFullscreen;
  //   await this.currentWindow.setFullscreen(this.isFullscreen);
  // }
  //
  // async toggleAlwaysOnTop() {
  //   this.isAlwaysOnTop = !this.isAlwaysOnTop;
  //   await this.currentWindow.setAlwaysOnTop(this.isAlwaysOnTop);
  // }
  //
  // async minimize() {
  //   await this.currentWindow.minimize();
  // }
  //
  // async maximize() {
  //   await this.currentWindow.maximize();
  // }
  //
  // async close() {
  //   await this.currentWindow.close();
  // }
}

export const windowStore = new WindowStore();
