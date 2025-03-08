import { makeAutoObservable } from 'mobx';

class AnimationStore {
    scale = 1;
    opacity = 1;
    navbarX = -350;
    currentAnimation = null; // Додаємо стан для керування анімаціями

    constructor() {
        makeAutoObservable(this);
    }

    setScale(value: number) {
        this.scale = value;
    }

    setOpacity(value: number) {
        this.opacity = value;
    }

    setNavbarX(value: number)   {
        this.navbarX = value;
    }

    setCurrentAnimation(animationName) {
        this.currentAnimation = animationName;
    }

    clearCurrentAnimation() {
        this.currentAnimation = null;
    }
}

export const animationStore = new AnimationStore();