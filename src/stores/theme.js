import { action, makeAutoObservable, reaction } from "mobx";
import { GradientMaker } from "@components/classes/GradientMaker";
import chroma from "chroma-js";

const DARK = 0;
const LIGHT = 1;

const ultraSpringTheme = {
  tension: 50,
  friction: 75,
  mass: 5,
  damping: 100,
  precision: 0.0001,
};

import { core } from "./core.js";
import { logger } from "@stores/logger.js";

class ThemeStore {
  uiStore = null;
  themesWorker = null;
  themeController = {};
  preparedThemes = [
    [null, null, null, null, null],
    [null, null, null, null, null],
  ];
  selectedThemes = [0, 0];
  selectedThemeType = this.uiStore?.themeIsDark ? 0 : 1;
  selectedThemeIndex = this.selectedThemes[this.selectedThemeType];

  constructor() {
    makeAutoObservable(this, {
      calculateTheme: action,
      setUIStore: action,
    });

    // Инициализируем контроллер с задержкой
    setTimeout(() => {
      if (core) {
        this.themeController = core.createController(
          "mainThemeController",
          this._getTheme(),
          { config: ultraSpringTheme },
        );
      }
    }, 100);

    this.themesInit();
  }

  get animatedTheme() {
    return this.themeController.springs;
  }

  setupPreparedTheme = (themeType, themeIndex) =>
    (this.preparedThemes[themeType][themeIndex] = GradientMaker.calculateTheme(
      themeType,
      themeIndex,
    ));

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async themesInit() {
    let darkCanWork = true;
    let lightCanWork = true;

    if (
      this.preparedThemes[this.selectedThemeType][this.selectedThemeIndex] ===
      null
    ) {
      this.setupPreparedTheme(this.selectedThemeType, this.selectedThemeIndex);
      await this.delay(1000);
      const type = this.selectedThemeType === LIGHT ? DARK : LIGHT;
      this.setupPreparedTheme(type, this.selectedThemes[type]);
      await this.delay(1000);
    }

    this.themesWorker = setInterval(() => {
      if (darkCanWork) {
        for (let i = 0; i < 5; i++) {
          if (this.preparedThemes[0][i] === null) {
            GradientMaker.calculateTheme(DARK, i);
            darkCanWork = false;
            lightCanWork = true;
            break;
          }
        }
      } else {
        for (let i = 0; i < 5; i++) {
          if (this.preparedThemes[1][i] === null) {
            GradientMaker.calculateTheme(LIGHT, i);
            darkCanWork = true;
            lightCanWork = false;
            break;
          }
        }
      }

      if (lightCanWork && darkCanWork) {
        this.themesWorker = null;
        logger.success("All themes calculated!!!", null, 30);
      }
    }, 1000);
  }

  setUIStore = (store) => {
    this.uiStore = store;
    this.setupReactions();
  };

  setupReactions() {
    reaction(
      () => this.uiStore?.themeIsDark,
      (isDark) => {
        logger.info(`Theme changed to`, isDark ? "dark" : "light");
        this.switchTheme();
      },
    );
  }

  _getTheme() {
    logger.warning("getTheme");
    return this.preparedThemes[this.selectedThemeType][this.selectedThemeIndex];
  }

  switchTheme = () => {
    if (this.themeController.springs) {
      this.themeController.to(this._getTheme(), {
        ...ultraSpringTheme,
      });
    }
  };
}

export const themeStore = new ThemeStore();
