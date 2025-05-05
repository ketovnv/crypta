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

  themeController = new Controller({...gradientStore.getTheme});

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
    return {...gradientStore.getTheme}
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
