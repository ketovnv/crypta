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

export class GradientMaker {
  RAINBOWGRADIENT = RAINBOWGRADIENT;

  static getStandartTheme(standart_colors_array) {
    const background = this.circleGradient(
      standart_colors_array.bg[0],
      standart_colors_array.bg[1],
      standart_colors_array.bg[2],
      standart_colors_array.bg[3],
    );

    const navBarButtonBackground = this.circleGradient(
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

  static createOklchGradient = (colors, steps, fixedAlpha) => {
    // 1. Парсим входные цвета с сохранением альфа-канала
    const parsedColors = colors.map((color) => {
      const chromaColor = chroma(color);
      const [l, c, h] = chromaColor.oklch();
      const alpha = chromaColor.alpha();
      return { l, c, h: isNaN(h) ? 0 : h, alpha };
    });

    // 2. Создаем функцию интерполяции с учетом альфа-канала
    const interpolate = (color1, color2, t) => {
      // Интерполяция компонентов
      const l = color1.l + (color2.l - color1.l) * t;
      const c = color1.c + (color2.c - color1.c) * t;
      const alpha = color1.alpha + (color2.alpha - color1.alpha) * t;

      // Интерполяция оттенка с кратчайшим путем
      let h = color1.h;
      if (color1.h !== color2.h) {
        let diff = color2.h - color1.h;
        if (diff > 180) diff -= 360;
        else if (diff < -180) diff += 360;
        h = color1.h + diff * t;
      }

      return { l, c, h, alpha };
    };

    // 3. Генерируем цвета градиента
    const resultColors = [];
    const segments = parsedColors.length - 1;
    const colorsPerSegment = Math.max(1, Math.floor(steps / segments));

    for (let i = 0; i < segments; i++) {
      const color1 = parsedColors[i];
      const color2 = parsedColors[i + 1];

      for (let j = 0; j < colorsPerSegment; j++) {
        const t = j / colorsPerSegment;
        const interpolated = interpolate(color1, color2, t);

        // Используем фиксированную альфу если задана
        const alpha =
          fixedAlpha !== undefined ? fixedAlpha : interpolated.alpha;

        resultColors.push(
          `oklch(${interpolated.l.toFixed(3)} ${interpolated.c.toFixed(3)} ${interpolated.h.toFixed(1)} / ${alpha})`,
        );
      }
    }

    // Добавляем последний цвет
    const lastColor = parsedColors[parsedColors.length - 1];
    const alpha = fixedAlpha !== undefined ? fixedAlpha : lastColor.alpha;
    resultColors.push(
      `oklch(${lastColor.l.toFixed(3)} ${lastColor.c.toFixed(3)} ${lastColor.h.toFixed(1)} / ${alpha})`,
    );

    // 4. Корректируем количество цветов при необходимости
    if (resultColors.length > steps) {
      resultColors.length = steps;
    } else if (resultColors.length < steps) {
      const last = resultColors[resultColors.length - 1];
      while (resultColors.length < steps) {
        resultColors.push(last);
      }
    }

    return resultColors.join(", ");
  };

  // Методы генерации градиентов
  static scaleGradient(colors, number = 64) {
    const chromaColors = chroma
      .scale(colors)
      .mode("oklch") // Активируем режим ДО генерации цветов
      .colors(number)
      .map((c) => {
        const [l, ch, h] = chroma(c).oklch();
        const hue = isNaN(h) ? 0 : Math.round(h); // Заменяем NaN и округляем
        return `oklch(${l.toFixed(3)} ${ch.toFixed(3)} ${ch.toFixed(2)} / 99%)`;
      })
      .join(", ");

    // const chromaColors = chroma

    //   .scale()
    //   .mode("oklch")
    //   .colors(number)
    //   .join(", ");

    // const chromaColors = chroma
    //   .bezier(colors) // Создаём кривую Безье
    //   .scale() // Преобразуем в цветовую шкалу
    //   .mode("oklch")
    //   .colors(number)
    //   .map((c) => {
    //     const [l, ch, h] = chroma(c).oklch();
    //     const hue = isNaN(h) ? 0 : Math.round(h);
    //     return `oklch(${l.toFixed(2)} ${ch.toFixed(3)} ${hue} none)`;
    //   })
    //   .join(", ");

    // logger.warning("getTheme");

    logger.logRandomColors("chroma", chromaColors);
    return chromaColors;
  }

  static calculateTheme(themeType, themeIndex) {
    const isDark = themeType === 0;
    let calculatedTheme;
    switch (themeIndex) {
      case 0:
        calculatedTheme = isDark
          ? this.darkCubehelixMode
          : this.lightCubehelixMode;
        break;
      case 1:
        calculatedTheme = isDark
          ? this.getStandartTheme(STANDART_DARK)
          : this.getStandartTheme(STANDART_LIGHT);
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
        calculatedTheme = isDark
          ? this.getStandartTheme(STANDART_DARK)
          : this.getStandartTheme(STANDART_LIGHT);
    }
    return {
      ...calculatedTheme,
      bWG: this.blackWhiteGradient(isDark),
    };
  }

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

  static circleGradient(colors, number = 64, angle, angleTwo) {
    logger.logRandomColors("to chroma", colors);
    return `radial-gradient(in oklch circle at ${angle}% ${angleTwo}%, ${this.scaleGradient(colors, number)})`;
  }

  static linearAngleGradient(colors, number = 64, angle) {
    return `linear-gradient(${angle}deg in oklch, ${this.createOklchGradient(colors, number)})`;
  }

  static linearAngleGradientCubehelix(
    start,
    rotations,
    gamma,
    lightnessStart,
    lightnessEnd,
    number = 64,
    angle,
  ) {
    return `linear-gradient(${angle}deg in oklch, ${this.scaleCubehelix(start, rotations, gamma, lightnessStart, lightnessEnd, number)})`;
  }

  static scaleCubehelix(
    start,
    rotations,
    gamma,
    lightnessStart,
    lightnessEnd,
    number,
  ) {
    return chroma
      .cubehelix()
      .start(start)
      .rotations(rotations)
      .gamma(gamma)
      .lightness([lightnessStart, lightnessEnd])
      .scale()
      .correctLightness()
      .colors(number);
  }

  static averageOklch(colors) {
    return chroma.average(colors, "oklch");
  }

  static averageHex(colors) {
    return chroma.average(colors, "hex");
  }

  static chromaSpectral() {
    return chroma.scale("Spectral").domain([1, 0]);
  }
}
