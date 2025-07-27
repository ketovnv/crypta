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
} from "@components/classes/gradientColors.js";
import { logger } from "@stores/logger.js";
import { core } from "@stores/core.js";
import { uiStore } from "@stores/ui.js";

// import ParallelGradientSystem from "./parallelGradientSystem.js";

export class GradientMaker {
  RAINBOWGRADIENT = RAINBOWGRADIENT;

  static getStandartTheme(standart_colors_array) {
    const background = this.circleGradient(
      standart_colors_array.bg[0],
      standart_colors_array.bg[1],
      standart_colors_array.bg[2],
      standart_colors_array.bg[3],
    );

    const navBarButtonBackground = thisis.circleGradient(
      standart_colors_array.nbbb[0],
      standart_colors_array.nbbb[1],
      standart_colors_array.nbbb[2],
      standart_colors_array.nbbb[3],
    );

    return {
      color: standart_colors_array.c,
      accentColor: standart_colors_array.c,
      boxShadow: standart_colors_array.bs,
      background: background,
      // background: 'transparent',
      navBarButtonBackground: navBarButtonBackground,
      buttonStartColor: standart_colors_array.nbbb[0][0],
      buttonStopColor: standart_colors_array.nbbb[0][3],
      navBarButtonText: standart_colors_array.nbbt,
      navBarActiveButtonText: standart_colors_array.nbabt,
    };
  }

  static getRedGradient(isDark) {
    return isDark ? redGradientDark : redGradientLight;
  }

  // Методы генерации градиентов
  static scaleGradient(colors, number = 64) {
    return chroma
      .bezier(colors)
      .scale()
      .mode("oklch")
      .colors(number)
      .join(", ");
  }

  static calculateTheme = (themeType, themeIndex) => {
    const isDark = themeType === 0;
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

      case 22:
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
    return {
      ...calculatedTheme,
      bWG: this.blackWhiteGradient(isDark),
    };
  };

  // Все вспомогательные методы остаются без изменений
  static blackWhiteGradient(isDark) {
    return this.linearAngleGradient(
      isDark
        ? ["oklch(1 0 0)", "oklch(0 0 0)"]
        : ["oklch(0 0 0)", "oklch(1 0 0)"],
      64,
      0,
    );
  }

  // Все темы теперь возвращают единый формат
  static darkCubehelixMode() {
    const colors = this.scaleCubehelix(225, 0.2, 1, 0.01, 0.09, 64);
    const navColors = this.scaleCubehelix(275, 0.2, 0.9, 0.08, 0.1, 32);

    return {
      c: "oklch(0.97 0.1 100.29)",
      ac: "oklch(0.89 0.2631 111.18)",
      bs: "2px 1px rgba(25, 100, 50, 0.05)",
      bg: [colors.slice(0, 6), 64, 45, 135], // 6 цветов, number, angle1, angle2
      nbbb: [navColors.slice(0, 4), 32, 45, 125],
      nbbt: ["#10CCDD", "#4079ff", "#99FFFF", "#0000ff", "#1050CC"],
      nbabt: ["#FFFF00", "#FFFF99", "#CCCCCC", "#FFFF00", "#FFFFDD"],
    };
  }

  static lightCubehelixMode() {
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

  static circleGradient = (colors, number = 64, angle, angleTwo) =>
    `radial-gradient(in oklch circle at ${angle}% ${angleTwo}%, ${this.scaleGradient(colors, number)})`;

  static linearAngleGradient = (colors, number = 64, angle) =>
    `linear-gradient(${angle}deg in oklch, ${this.scaleGradient(colors, number)})`;

  static linearAngleGradientCubehelix = (
    start,
    rotations,
    gamma,
    lightnessStart,
    lightnessEnd,
    number = 64,
    angle,
  ) =>
    `linear-gradient(${angle}deg in oklch, ${this.scaleCubehelix(start, rotations, gamma, lightnessStart, lightnessEnd, number)})`;

  static scaleCubehelix = (
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

  static averageOklch = (colors) => chroma.average(colors, "oklch");
  static averageHex = (colors) => chroma.average(colors, "hex");
  static chromaSpectral = () => chroma.scale("Spectral").domain([1, 0]);
}
