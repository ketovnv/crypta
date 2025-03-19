import { makeAutoObservable } from "mobx";

export const ANIMATION_DURATION = {
  VERY_SHORT: 300,
  SHORT: 500,
  MEDIUM: 800,
  LONG: 1200,
  VERY_LONG: 1700,
  EXTRA_LONG: 2500,
  EXTRA_LONG_XL: 3500,
  EXTRA_LONG_XXL: 5000,
}



class AnimationStore {
  scale = 1;
  opacity = 1;
  navbarX = -350;
  currentAnimation = null;

  constructor() {
    makeAutoObservable(this);
  }

  setScale(value: number) {
    this.scale = value;
  }

  setOpacity(value: number) {
    this.opacity = value;
  }

  setNavbarX(value: number) {
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
