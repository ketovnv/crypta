// gradient.js - унифицированная версия

import { action, makeAutoObservable, reaction } from "mobx";
import chroma from "chroma-js";
import {
  RAINBOWGRADIENT,
  RAINBOWV2GRADIENT,
  redGradientDark,
  redGradientLight,
  STANDART_DARK,
  STANDART_LIGHT,
} from "./gradientColors";
import { logger } from "./logger.js";
import { core } from "./core.js";
import ParallelGradientSystem from "./parallelGradientSystem.js";

const DARK = 0;
const LIGHT = 1;

class GradientStore {
  uiStore = null;
  themesWorker = null;
  themeController = null;
  preparedDarkThemes = [null, null, null, null, null];
  preparedLightThemes = [null, null, null, null, null];
  selectedThemes = [0, 0];

  constructor() {
    makeAutoObservable(this, {
      calculateTheme: action,
      setUIStore: action,
      themeController: false,
    });

    this.parallelGradientSystem = new ParallelGradientSystem();

    // Инициализируем контроллер с задержкой
    setTimeout(() => {
      if (core) {
        this.themeController = core.createController(
          "mainThemeController",
          this.getTheme,
          { config: core.getAnimationPreset("gentle") },
        );
      }
    }, 100);

    this.themesInit();
  }

  // Все темы теперь возвращают единый формат
  get darkCubehelixMode() {
    const colors = this.scaleCubehelix(225, 0.2, 1, 0.01, 0.09, 64);
    const navColors = this.scaleCubehelix(275, 0.2, 0.9, 0.08, 0.1, 32);

    return {
      c: "oklch(0.95 0.05 149.29)",
      ac: "oklch(0.89 0.2631 111.18)",
      bs: "2px 1px rgba(25, 100, 50, 0.05)",
      bg: [colors.slice(0, 6), 64, 45, 135], // 6 цветов, number, angle1, angle2
      nbbb: [navColors.slice(0, 4), 32, 45, 125],
      nbbt: ["#10CCDD", "#4079ff", "#99FFFF", "#0000ff", "#1050CC"],
      nbabt: ["#FFFF00", "#FFFF99", "#CCCCCC", "#FFFF00", "#FFFFDD"],
    };
  }

  get lightCubehelixMode() {
    const colors = this.scaleCubehelix(225, 0.2, 0.5, 0.4, 0.7, 64);

    return {
      c: "oklch(0.01 0 0)",
      ac: "oklch(0.42 0.2086 263.9)",
      bs: "2px 1px rgba(0, 0, 0, 0.15)",
      bg: [colors.slice(0, 6), 64, 45, 125],
      nbbb: [["#f0Daa0", "#F9F9DD", "#fafa99", "#FFFFED"], 32, 0, 250],
      nbbt: ["#000055", "#4079ff", "#0525FF", "#0000ff", "#1050CC"],
      nbabt: ["#FF5500", "#CC5500", "#FFEE00", "#BB7700", "#771100"],
    };
  }

  get animatedTheme() {
    return this.themeController?.springs || this.getTheme;
  }

  get getTheme() {
    if (!this.uiStore) {
      return this.getColorTheme(STANDART_DARK);
    }

    const selectedThemeIndex =
      this.selectedThemes[this.uiStore.themeIsDark ? 0 : 1];
    const themeData = this.uiStore.themeIsDark
      ? this.preparedDarkThemes[selectedThemeIndex]
      : this.preparedLightThemes[selectedThemeIndex];

    if (!themeData) {
      const fallback = this.uiStore.themeIsDark
        ? STANDART_DARK
        : STANDART_LIGHT;
      return this.getColorTheme(fallback);
    }

    const theme = this.getColorTheme(themeData);
    return {
      ...theme,
      bWG: this.blackWhiteGradient,
    };
  }

  // Все вспомогательные методы остаются без изменений
  get blackWhiteGradient() {
    return this.linearAngleGradient(
      this.uiStore?.themeIsDark
        ? ["oklch(1 0 0)", "oklch(0 0 0)"]
        : ["oklch(0 0 0)", "oklch(1 0 0)"],
      64,
      0,
    );
  }

  get getRedGradient() {
    return this.uiStore?.themeIsDark ? redGradientDark : redGradientLight;
  }

  get getRainbowV2Gradient() {
    return RAINBOWV2GRADIENT;
  }

  get getRainbowGradient() {
    return RAINBOWGRADIENT;
  }

  // Единый метод преобразования любой темы в стандартный формат
  normalizeTheme(themeData) {
    // Если тема уже в правильном формате (как STANDART_DARK)
    if (themeData.c && themeData.bg && themeData.nbbb) {
      return themeData;
    }

    // Преобразуем любую тему в стандартный формат
    // Для cubehelix и других сложных тем
    if (themeData.color && themeData.background) {
      // Парсим градиенты обратно в массивы цветов
      const bgColors = this.extractColorsFromGradient(themeData.background);
      const nbbbColors = this.extractColorsFromGradient(
        themeData.navBarButtonBackground,
      );

      return {
        c: themeData.color,
        ac: themeData.accentColor || themeData.color,
        bs: themeData.boxShadow,
        bg: [bgColors, 64, 50, 50], // стандартные параметры для circleGradient
        nbbb: [nbbbColors, 32, 50, 50],
        nbbt: themeData.navBarButtonText || [
          "#10CCDD",
          "#4079ff",
          "#99FFFF",
          "#0000ff",
          "#1050CC",
        ],
        nbabt: themeData.navBarActiveButtonText || [
          "#FFFF00",
          "#FFFF99",
          "#CCCCCC",
          "#FFFF00",
          "#FFFFDD",
        ],
      };
    }

    // Fallback на темную тему
    return STANDART_DARK;
  }

  // Вспомогательный метод для извлечения цветов из CSS градиента
  extractColorsFromGradient(gradient) {
    // Извлекаем oklch цвета из градиента
    const oklchMatches = gradient.match(/oklch\([^)]+\)/g);
    if (oklchMatches && oklchMatches.length >= 4) {
      return oklchMatches.slice(0, 4);
    }

    // Fallback на стандартные цвета
    return ["#101010", "#202020", "#303030", "#404040"];
  }

  // Генераторы тем тоже возвращают нормализованный формат
  generateAdvancedGradientTheme(isDark) {
    const baseHue = isDark ? 240 : 60;
    const bgColors = Array.from({ length: 6 }, (_, i) =>
      chroma
        .oklch(
          isDark ? 0.3 - i * 0.05 : 0.8 + i * 0.05,
          0.15 - i * 0.02,
          (baseHue + i * 60) % 360,
        )
        .hex(),
    );

    const nbbbColors = bgColors.slice(0, 4);

    return {
      c: isDark ? "oklch(0.95 0.05 240)" : "oklch(0.15 0.05 60)",
      ac: isDark ? "oklch(0.75 0.2 260)" : "oklch(0.55 0.2 80)",
      bs: isDark
        ? "2px 1px rgba(100, 150, 200, 0.1)"
        : "2px 1px rgba(200, 150, 100, 0.15)",
      bg: [bgColors, 64, 25, 75],
      nbbb: [nbbbColors, 32, 50, 50],
      nbbt: isDark
        ? ["#70C0FF", "#90A0FF", "#B0FFFF", "#6080FF", "#8090FF"]
        : ["#2060AA", "#4070BB", "#1050AA", "#3060BB", "#2050AA"],
      nbabt: isDark
        ? ["#FFFF80", "#FFFF90", "#FFFFAA", "#FFFF80", "#FFFFBB"]
        : ["#FF6600", "#DD5500", "#FFAA00", "#CC6600", "#BB4400"],
    };
  }

  generateCustomComplexTheme(isDark) {
    const baseHue = (Date.now() * 0.618034) % 360;
    const bgColors = Array.from({ length: 6 }, (_, i) =>
      chroma
        .oklch(
          isDark ? 0.2 + i * 0.08 : 0.9 - i * 0.08,
          0.1 + i * 0.03,
          (baseHue + i * 60) % 360,
        )
        .hex(),
    );

    return {
      c: isDark ? `oklch(0.95 0.03 ${baseHue})` : `oklch(0.1 0.03 ${baseHue})`,
      ac: chroma.oklch(isDark ? 0.7 : 0.5, 0.2, (baseHue + 180) % 360).css(),
      bs: `2px 1px ${chroma(bgColors[0]).alpha(0.1).css()}`,
      bg: [bgColors, 64, Math.round(baseHue / 7), Math.round(baseHue / 3)],
      nbbb: [bgColors.slice(2, 6), 32, 33, 67],
      nbbt: bgColors.slice(0, 5).map((c) =>
        chroma(c)
          .set("oklch.l", isDark ? 0.8 : 0.3)
          .hex(),
      ),
      nbabt: bgColors.slice(0, 5).map((c) =>
        chroma(c)
          .set("oklch.l", isDark ? 0.95 : 0.15)
          .hex(),
      ),
    };
  }

  generateMegaGradientTheme(isDark) {
    const seedHue = (Date.now() * 0.381966) % 360;
    const bgColors = Array.from({ length: 6 }, (_, i) => {
      const hue = (seedHue + i * 60) % 360;
      const lightness = isDark
        ? 0.15 + (Math.sin((i * Math.PI) / 3) + 1) * 0.15
        : 0.75 + (Math.cos((i * Math.PI) / 3) + 1) * 0.1;
      const chroma_val = 0.08 + (i % 3) * 0.04;

      return chroma.oklch(lightness, chroma_val, hue).hex();
    });

    return {
      c: isDark ? "oklch(0.95 0.02 0)" : "oklch(0.05 0.02 0)",
      ac: chroma.oklch(isDark ? 0.7 : 0.5, 0.15, seedHue).css(),
      bs: `2px 1px ${chroma
        .oklch(isDark ? 0.4 : 0.7, 0.1, seedHue)
        .alpha(0.15)
        .css()}`,
      bg: [bgColors, 64, 50, 50],
      nbbb: [bgColors.slice(2, 6), 32, 45, 135],
      nbbt: Array.from({ length: 5 }, (_, i) =>
        chroma.oklch(isDark ? 0.8 : 0.3, 0.1, (seedHue + i * 72) % 360).hex(),
      ),
      nbabt: Array.from({ length: 5 }, (_, i) =>
        chroma
          .oklch(isDark ? 0.95 : 0.15, 0.15, (seedHue + i * 72 + 36) % 360)
          .hex(),
      ),
    };
  }

  // Единый метод для получения темы в финальном формате
  getColorTheme = (theme) => {
    const normalized = this.normalizeTheme(theme);

    return {
      color: normalized.c,
      accentColor: normalized.ac || normalized.c,
      boxShadow: normalized.bs,
      background: this.circleGradient(
        normalized.bg[0],
        normalized.bg[1],
        normalized.bg[2],
        normalized.bg[3],
      ),
      navBarButtonBackground: this.circleGradient(
        normalized.nbbb[0],
        normalized.nbbb[1],
        normalized.nbbb[2],
        normalized.nbbb[3],
      ),
      buttonStartColor: normalized.nbbb[0][0],
      buttonStopColor: normalized.nbbb[0][3],
      navBarButtonText: normalized.nbbt,
      navBarActiveButtonText: normalized.nbabt,
    };
  };

  calculateTheme = (themeType, themeIndex) => {
    const isDark = themeType === DARK;
    const targetArray = isDark
      ? this.preparedDarkThemes
      : this.preparedLightThemes;

    let calculatedTheme;
    switch (themeIndex) {
      case 0:
        calculatedTheme = isDark
          ? this.darkCubehelixMode
          : this.lightCubehelixMode;
        break;
      case 1:
        calculatedTheme = isDark ? STANDART_DARK : STANDART_LIGHT;
        break;
      case 2:
        calculatedTheme = this.generateAdvancedGradientTheme(isDark);
        break;
      case 3:
        calculatedTheme = this.generateCustomComplexTheme(isDark);
        break;
      case 4:
        calculatedTheme = this.generateMegaGradientTheme(isDark);
        break;
      default:
        calculatedTheme = isDark ? STANDART_DARK : STANDART_LIGHT;
    }

    targetArray[themeIndex] = calculatedTheme;
    return calculatedTheme;
  };

  setUIStore = (store) => {
    this.uiStore = store;
    this.setupReactions();
  };

  themesInit() {
    this.themesWorker = setInterval(() => {
      let hasWork = false;

      this.preparedDarkThemes.forEach((theme, index) => {
        if (theme === null) {
          this.calculateTheme(DARK, index);
          hasWork = true;
          return false;
        }
      });

      if (!hasWork) {
        this.preparedLightThemes.forEach((theme, index) => {
          if (theme === null) {
            this.calculateTheme(LIGHT, index);
            hasWork = true;
            return false;
          }
        });
      }

      if (!hasWork) {
        clearInterval(this.themesWorker);
        this.themesWorker = null;
        logger.info("All themes calculated");
      }
    }, 1000);
  }

  setupReactions() {
    reaction(
      () => this.uiStore?.themeIsDark,
      (isDark) => {
        logger.info(`Theme changed to: ${isDark ? "dark" : "light"}`);

        if (this.themeController) {
          // Анимируем на новую тему
          this.themeController.to(this.getTheme, {
            ...core.getAnimationPreset("gentle"),
            duration: 800,
          });
        }
      },
    );
  }

  switchTheme = (themeIndex) => {
    if (themeIndex < 0 || themeIndex >= 5) return;

    const currentThemeType = this.uiStore?.themeIsDark ? 0 : 1;
    this.selectedThemes[currentThemeType] = themeIndex;

    if (this.themeController) {
      this.themeController.to(this.getTheme, {
        ...core.getAnimationPreset("bouncy"),
        duration: 600,
      });
    }
  };

  // Методы генерации градиентов
  scaleGradient = (colors, number = 64) =>
    chroma.bezier(colors).scale().mode("oklch").colors(number).join(", ");

  circleGradient = (colors, number = 64, angle, angleTwo) =>
    `radial-gradient(in oklch circle at ${angle}% ${angleTwo}%, ${this.scaleGradient(colors, number)})`;

  linearAngleGradient = (colors, number = 64, angle) =>
    `linear-gradient(${angle}deg in oklch, ${this.scaleGradient(colors, number)})`;

  linearAngleGradientCubehelix = (
    start,
    rotations,
    gamma,
    lightnessStart,
    lightnessEnd,
    number = 64,
    angle,
  ) =>
    `linear-gradient(${angle}deg in oklch, ${this.scaleCubehelix(start, rotations, gamma, lightnessStart, lightnessEnd, number)})`;

  scaleCubehelix = (
    start,
    rotations,
    gamma,
    lightnessStart,
    lightnessEnd,
    number,
  ) =>
    chroma
      .cubehelix()
      .start(start)
      .rotations(rotations)
      .gamma(gamma)
      .lightness([lightnessStart, lightnessEnd])
      .scale()
      .correctLightness()
      .colors(number);

  averageOklch = (colors) => chroma.average(colors, "oklch");
  averageHex = (colors) => chroma.average(colors, "hex");
  chromaSpectral = () => chroma.scale("Spectral").domain([1, 0]);
}

export const gradientStore = new GradientStore();
