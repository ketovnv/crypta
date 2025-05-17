import {action, makeAutoObservable, runInAction} from "mobx";
import {invoke} from "@tauri-apps/api/core";
import {uiStore} from "./ui";
import {logger} from "./logger";
import {windowStore} from "./window.ts";

export interface MonitorMode {
    width: number;
    height: number;
    refresh_rate: number;
    is_current: boolean;
}

class GpuStore {
    isGpuEnabled = true;
    loading = true
    backgroundEnabled = true;
    gpuInfo: Record<string, any> = {};
    modes: MonitorMode[] = [];
    currentMode: MonitorMode = null;
    maxRefreshRate = 60

    constructor() {
        makeAutoObservable(this, {fetchMonitorModes: action});
        this.fetchGpuInfo();
    }

    toggleGpu() {
        this.isGpuEnabled = !this.isGpuEnabled;
    }

    toggleBackground() {
        this.backgroundEnabled = !this.backgroundEnabled;
    }

    async fetchGpuInfo() {
        try {
            this.gpuInfo = await invoke("get_gpu_info");
        } catch (e) {
            console.error("GPU info fetch failed", e);
        }
    }

    async fetchMonitorModes() {
        try {
            this.loading = true;
            const modes = await invoke<MonitorMode[]>("get_monitor_modes");
            runInAction(() => {
                modes.forEach(
                    mode => {
                        // logger.debug(modes.length)
                        if (this.modes.length === 0
                            ||
                            mode.is_current
                            ||
                            this.modes[this.modes.length - 1].width !== mode.width ||
                            this.modes[this.modes.length - 1].refresh_rate !== mode.refresh_rate
                        ) this.modes.push(mode)
                        mode.refresh_rate > this.maxRefreshRate &&
                        (this.maxRefreshRate = mode.refresh_rate)
                    })
                console.log(this.modes)
                this.currentMode = this.modes.find(mode => mode.is_current)
                this.loading = false;
            })
        } catch (e) {
            console.error("Monitor modes fetch failed", e);
        }
    }

    async setWindowSize(width: number, height: number) {
        try {

            await invoke("set_window_size", {width, height});
        } catch (e) {
            console.error("Failed to set window size", e);
        }
    }

    async setResolution(mode: MonitorMode) {
        try {
            await invoke("set_monitor_resolution", {
                width: mode.width,
                height: mode.height,
                refreshRate: mode.refresh_rate
            });
            this.fetchMonitorModes();
        } catch (e) {
            console.error("Failed to set resolution", e);
        }
    }
}

export const gpuStore = new GpuStore();
