import { action, makeAutoObservable, observable } from "mobx";
import { logger } from "./logger";

export const ANIMATION_DURATION = {
  VERY_SHORT: 300,
  SHORT: 500,
  MEDIUM: 800,
  LONG: 1200,
  VERY_LONG: 1700,
  EXTRA_LONG: 2500,
  EXTRA_LONG_XL: 3500,
  EXTRA_LONG_XXL: 5000,
};

const animations = {
  dark: {
    background: "linear-gradient(135deg,#111111,#222222,#333333,#444444)",
  },
  light: {
    background: "linear-gradient(135deg,#FFFFFF,#EEEEEE,#DDDDDD,#CCCCCC)",
  },
};

class AnimationStore {
  scale = 1;
  opacity = 1;
  navbarX = -350;
  currentAnimation = null;
  optionsTransitionsTestState = 0;
  themeGradient = "linear-gradient(135deg,#111111,#222222,#333333,#444444)";
  springApi = null;

  constructor() {
    makeAutoObservable(this, {
      springApi: observable.ref, // <-- ВАЖНО! Не даёт MobX мутировать объект
    });
  }

  get getThemeBackGround() {
    return this.themeGradient;
    // return uiStore.themeIsDark
    //   ? animations.dark.background
    //   : animations.light.background;
  }

  setSpringApi(api) {
    console.log("API перед сохранением:", api);
    this.springApi = api; // Записываем API анимации в хранилище
  }

  @action
  toggleTheme() {
    logger.logJSON("метод start?", this.springApi);
    if (this.springApi?.start) {
      // Проверяем, есть ли `start`
      this.springApi.start({
        background: this.themeGradient.includes("#222222")
          ? "linear-gradient(135deg,#111111,#222222,#333333,#444444)"
          : "linear-gradient(135deg,#FFFFFF,#EEEEEE,#DDDDDD,#CCCCCC)",
      });
    } else {
      console.error("springApi не содержит метод start!", this.springApi);
    }
  }

  @action
  changeOptionsTransitionsTestState() {
    logger.logRandomColors(
      "optionsTransitionsTestState до",
      this.optionsTransitionsTestState,
    );
    this.optionsTransitionsTestState =
      (this.optionsTransitionsTestState + 1) % 3;
    logger.logRandomColors(
      "optionsTransitionsTestState после",
      this.optionsTransitionsTestState,
    );
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

export const animation = new AnimationStore();
