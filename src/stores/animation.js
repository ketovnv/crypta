import {action, makeAutoObservable, observable} from "mobx";

import {uiStore} from "@stores/ui.js";

import {gradientStore} from "@stores/gradient";
import {Controller} from "@react-spring/web";

const APP_NAME = "ReactApproveAppkit";
const appNameArray = APP_NAME.split("");

class AnimationStore {
  appNameIsHover = false;
  mantineControlAnimations = {};
  springAnimations = {};

  themeController = new Controller({
    ...gradientStore.darkMode,
    color: "oklch(0.95 0 0)",
    boxShadow: "2px 1px rgba(0, 150, 150, 0.05)",
    config: {
      tension: 50,
      friction: 50,
      mass: 10,
      damping: 10,
      precision: 0.0001,
    },
  });

  constructor() {
    makeAutoObservable(this, {
      mantineControlAnimations: observable.ref,
      springAnimations: observable.ref,
      themeController: observable.ref,
      setMantineControlAnimation: action,
      setSpringAnimation: action,
      setAppNameIsHover: action,
    });
  }

  get getAppNameArray() {
    return appNameArray;
  }

  get getAppNameIsHover() {
    return this.appNameIsHover;
  }


  get theme() {
    return uiStore.themeIsDark
      ? {
          ...gradientStore.darkMode,
          color: "oklch(0.99 0 0)",
          boxShadow: "2px 1px rgba(150, 150, 0, 0.05)",
        }
      : {
          ...gradientStore.lightMode,
          color: "oklch(0.01 0 0)",
          boxShadow: "2px 3px rgba(0, 0, 0, 0.7)",
        };
  }

  setAppNameIsHover = (isHover) => (this.appNameIsHover = isHover);

  getMCAnimation = (name) => this.mantineControlAnimations[name];

  @action
  setMantineControlAnimation = (newAnimation) =>
    (this.mantineControlAnimations = {
      ...newAnimation,
    });

  getSpringAnimation = (name) => this.springAnimations[name];

  @action
  setSpringAnimation = (newAnimation) => (this.springAnimations = newAnimation);


  setCurrentAnimation(animationName) {
    this.currentAnimation = animationName;
  }

  clearCurrentAnimation() {
    this.currentAnimation = null;
  }
}

export const animation = new AnimationStore();
