import { makeAutoObservable } from "mobx";

class AnimationStore {
    scale = 1;
    opacity = 1;
    x = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setScale(value: number) {
        this.scale = value;
    }

    setOpacity(value: number) {
        this.opacity = value;
    }

    setX(value: number) {
        this.x = value;
    }
}

export const animationStore = new AnimationStore();
