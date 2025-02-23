import {flow, makeAutoObservable, runInAction} from 'mobx';
import {RouteMeta, ROUTE_META, AppRoutes, routes} from '../components/Pages/routes';
import React, {useState} from "react";

const ROUTING_ANIMATIONS_DURATION = {
    SHORT: 500,
    MEDIUM: 800,
    LONG: 1200,
    VERY_LONG: 1700,
    EXTRA_LONG: 2500,
    EXTRA_LONG_XL: 3500,
    EXTRA_LONG_XXL: 5000
};

class RouterStore {
    private isLocationInit = false
    currentChildren = null
    previousChildren = null
    previousChildrenPath = '/'
    currentChildrenPath = '/'
    isAnimatingLong: number  = 0;


    constructor() {
        makeAutoObservable(this),
            {setCurrentChildren: flow}
    }


    get isLocationInitialized(): boolean {
        return this.isLocationInit;
    }

    startAnimation() {
        this.isAnimatingLong = ROUTING_ANIMATIONS_DURATION.EXTRA_LONG_XXL;
    }

    setLocationInitialized() {
        this.isLocationInit = true;
    }


    get currentRoute(): RouteMeta {
        return ROUTE_META[this.currentChildrenPath]
    }

    get previousRoute(): RouteMeta {
        return ROUTE_META[this.previousChildrenPath]
    }

    get isAnimating(): boolean {
        return this.isAnimatingLong !== 0;
    }



    async setCurrentChildren(
        children,
        path: string
    ) {

        // this.previousChildren = React.cloneElement(this.currentChildren)
        // this.currentChildren = children
        this.previousChildrenPath= this.currentChildrenPath
        this.currentChildrenPath = path

        this.isAnimatingLong =
            ROUTING_ANIMATIONS_DURATION[this.currentRoute.animationDuration]
            ?? ROUTING_ANIMATIONS_DURATION.MEDIUM;
        try {

            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, this.isAnimatingLong));


        } catch (error) {
            error = error.message;
            console.warn(`Error: ${error}`)

        } finally {
            console.warn(`конец анимации`)
            runInAction(() => {
                return this.isAnimatingLong = 0;
            })
        }


    }


    get currentPath(): string {
        return this.currentChildren.path ?? '/';
    }

    get previousPath(): string {
        return this.previousChildren.path ?? '/';
    }


}

export const routerStore = new RouterStore();