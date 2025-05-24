import { action, makeAutoObservable, observable } from "mobx";
import { uiStore } from "./ui";
import { gradientStore } from "./gradient";
import { Controller } from "@react-spring/web";
import { windowStore } from "@stores/window.js";
import { gpuStore } from "@stores/gpuStore.js";

const APP_NAME = "ReactApproveAppkit";
const appNameArray = APP_NAME.split("");

class AnimationStore {
  appNameIsHover = false;
  mantineControlAnimations = {};
  springAnimations = {};

  themeController = new Controller({ ...gradientStore.getTheme });

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

  // get getAppNameArray() {
  //   return appNameArray;
  // }

  get getAppNameArray() {
    return (
      // uiStore.screenSize.width + 'x' + uiStore.screenSize.height + "__"+
      (
        windowStore.width +
        "x" +
        windowStore.height +
        "__" +
        gpuStore.currentMode?.width +
        "x" +
        gpuStore.currentMode?.height
      ).split("")
    );
  }

  get getAppNameIsHover() {
    return this.appNameIsHover;
  }

  get theme() {
    return { ...gradientStore.getTheme };
  }

  setAppNameIsHover = (isHover) => (this.appNameIsHover = isHover);

  getMCAnimation = (name) => {
    console.log(name, this.mantineControlAnimations[name]);
    return this.mantineControlAnimations[name];
  };

  setMantineControlAnimation = (newAnimation) => {
    console.log("setMantineControlAnimation", newAnimation);
    this.mantineControlAnimations = {
      ...newAnimation,
    };
  };
  getSpringAnimation = (name) => this.springAnimations[name];

  setSpringAnimation = (newAnimation) => (this.springAnimations = newAnimation);

  setCurrentAnimation(animationName) {
    this.currentAnimation = animationName;
  }

  clearCurrentAnimation() {
    this.currentAnimation = null;
  }
}

export const animation = new AnimationStore();
