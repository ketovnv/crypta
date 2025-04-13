import { action, makeAutoObservable, observable } from "mobx";
import { uiStore } from "@stores/ui.js";
import { gradientStore } from "@stores/gradient";
import { Controller } from "@react-spring/web";

const APP_NAME = "ReactApproveAppkit";
const appNameArray = APP_NAME.split("");

class AnimationStore {
  appNameIsHover = false;
  mantineControlAnimations = {};
  springAnimations = {};

  themeController = new Controller({
    progress: uiStore.themeIsDark === "dark" ? 1 : 0,
    config: { tension: 170, friction: 26 },
  });

  constructor() {
    makeAutoObservable(this, {
      mantineControlAnimations: observable.ref,
      springAnimations: observable.ref,
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

  get getThemeColors() {
    const themeGradients = gradientStore.themeGradients;
    return uiStore.themeIsDark
      ? { color: "#FFFFFF", background: themeGradients.darkMode }
      : { color: "#000000 ", background: themeGradients.lightMode };
  }

  setAppNameIsHover = (isHover) => (this.appNameIsHover = isHover);

  getMCAnimation = (name) => this.mantineControlAnimations[name];

  @action
  setMantineControlAnimation = (newAnimation) =>
    (this.mantineControlAnimations = { ...newAnimation });

  getSpringAnimation = (name) => this.springAnimations[name];

  @action
  setSpringAnimation = (newAnimation) => (this.springAnimations = newAnimation);

  // toggleTheme() {
  //     logger.logJSON("метод start?", this.springApi);
  //     if (this.springApi?.start) {
  //         // Проверяем, есть ли `start`
  //         this.springApi.start({
  //             background: this.themeGradient.includes("#222222")
  //                 ? "linear-gradient(135deg,#111111,#222222,#333333,#444444)"
  //                 : "linear-gradient(135deg,#FFFFFF,#EEEEEE,#DDDDDD,#CCCCCC)",
  //         });
  //     } else {
  //         console.error("springApi не содержит метод start!", this.springApi);
  //     }
  // }

  setCurrentAnimation(animationName) {
    this.currentAnimation = animationName;
  }

  clearCurrentAnimation() {
    this.currentAnimation = null;
  }
}

export const animation = new AnimationStore();
