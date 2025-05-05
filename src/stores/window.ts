// src/stores/WindowManagerStore.ts
import {makeAutoObservable, runInAction} from 'mobx'
import {getCurrentWindow, LogicalPosition, LogicalSize} from '@tauri-apps/api/window'

export class WindowStore {
    currentWindow = null;
    width = 800
    height = 600
    x = 100
    y = 100
    isFullscreen = false
    isAlwaysOnTop = false

    constructor() {
        makeAutoObservable(this)
        this.init().then(()=>console.log('Window inited'));

    }

    async init() {
        runInAction(() => {
            this.currentWindow = getCurrentWindow()
        })
        const size = await this.currentWindow.innerSize()
        const pos = await this.currentWindow.outerPosition()
        const fs = await this.currentWindow.isFullscreen()
        const top = await this.currentWindow.isAlwaysOnTop()

        runInAction(() => {
            this.width = size.width
            this.height = size.height
            this.x = pos.x
            this.y = pos.y
            this.isFullscreen = fs
            this.isAlwaysOnTop = top
        })
    }

    setSize(w: number, h: number) {
        if (w === this.width && h === this.height) return
        this.width = w
        this.height = h
        this.applySize()
    }

    async applySize() {
        await appWindow.setSize(new LogicalSize(this.width, this.height))
    }

    setPosition(x: number, y: number) {
        this.x = x
        this.y = y
        appWindow.setPosition(new LogicalPosition(x, y))
    }

    async toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen
        await appWindow.setFullscreen(this.isFullscreen)
    }

    async toggleAlwaysOnTop() {
        this.isAlwaysOnTop = !this.isAlwaysOnTop
        await appWindow.setAlwaysOnTop(this.isAlwaysOnTop)
    }

    async minimize() {
        await appWindow.minimize()
    }

    async maximize() {
        await appWindow.maximize()
    }

    async close() {
        await appWindow.close()
    }
}

export const windowStore = new WindowStore()
