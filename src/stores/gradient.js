import { makeAutoObservable } from "mobx";
import { useSpring } from "@react-spring/web";
import chroma from "chroma-js";

class GradientStore {
  constructor() {
    makeAutoObservable(this);
  }

  get darkMode() {
    return {
      background: this.circleGradient(["#FFFF22", "#010101"], 20, 25, 270),
      navBarButtonBackground: this.circleGradient(
        ["#090909", "#252525"],
        12,
        100,
        50,
      ),
    };
  }

  get lightMode() {
    return {
      background: this.circleGradient(
        ["#fafaCC", "#FFFFDD", "#fafaCC", "#DDDDCC"],
        20,
        50,
        250,
      ),

      navBarButtonBackground: this.circleGradient(
        ["#f0faCC", "#F9F9DD", "#fafa99", "#FFE873"],
        12,
        50,
        250,
      ),
    };
  }

  get mainGradients() {
    return {
      light: {
        posX: 25,
        posY: 270,
        stops: lightStops,
      },
      dark: {
        posX: -25,
        posY: -270,
        stops: darkStops,
      },
    };
  }

  get springGradient() {
    return useSpring({
      // gradients: this.gradientConfig.colors,
      // angle: this.gradientConfig.angle,
      config: {
        mass: 1,
        tension: 180,
        friction: 20,
      },
    });
  }

  scaleGradient = (colors, number) =>
    chroma.bezier(colors).scale().mode("hsl").colors(number).join(", ");

  circleGradient = (colors, number, angle, angleTwo) =>
    `radial-gradient(in oklch circle at ${angle}% ${angleTwo}%, ${this.scaleGradient(colors, number)})`;

  setGradient(name) {
    // if (this.gradients[name]) {
    this.activeGradient = name;
    // }
  }

  // get gradientConfig() {
  //   return this.gradients[this.activeGradient];
  // }

  // Существующие методы
  setMantineControlAnimation(newAnimation) {
    this.mantineControlAnimations = {
      ...this.mantineControlAnimations,
      ...newAnimation,
    };
  }

  setSpringAnimation(newAnimation) {
    this.springAnimations = {
      ...this.springAnimations,
      ...newAnimation,
    };
  }

  // Новые методы для интерполяций
  createInterpolation(name, inputRange, outputRange, options = {}) {
    // const interpolator = interpolate(inputRange, outputRange, options);
    // this.interpolations[name] = interpolator;
    // return interpolator;
  }

  getInterpolation(name, value) {
    // if (!this.interpolations[name]) return value;
    // return this.interpolations[name](value);
  }

  // Методы для градиентов
  createGradient(name, colorStops, type = "linear") {
    // this.gradients[name] = {
    //   colorStops,
    //   type,
    //   getCSS: (angle = "90deg") => {
    //     if (type === "linear") {
    //       return `linear-gradient(${angle}, ${colorStops.join(", ")})`;
    //     } else if (type === "radial") {
    //       return `radial-gradient(circle, ${colorStops.join(", ")})`;
    //     }
    //     return "";
    //   },
    // };
  }

  getGradient(name, options = {}) {
    // if (!this.gradients[name]) return "";
    // return this.gradients[name].getCSS(options.angle);
  }

  // Динамическое обновление градиента
  updateGradient(name, colorStops) {
    // if (this.gradients[name]) {
    //   this.gradients[name].colorStops = colorStops;
    // }
  }

  // Интерполяция между двумя градиентами
  interpolateGradients(name, fromGradientName, toGradientName, progress) {
    // if (!this.gradients[fromGradientName] || !this.gradients[toGradientName])
    return;

    // const fromColors = this.gradients[fromGradientName].colorStops;
    // const toColors = this.gradients[toGradientName].colorStops;

    // Убедимся, что количество цветовых остановок совпадает
    // if (fromColors.length !== toColors.length) return;
    //
    // // Интерполировать каждую цветовую остановку
    // const interpolatedColors = fromColors.map((fromColor, index) => {
    //   // Здесь нужна функция interpolateColor, которую можно реализовать
    //   // с помощью color-interpolate или другой библиотеки
    //   return interpolateColor(fromColor, toColors[index], progress);
    // });

    this.createGradient(
      name,
      // interpolatedColors,
      // this.gradients[fromGradientName].type,
    );
  }
}

// Вспомогательная функция для интерполяции цветов
function interpolateColor(fromColor, toColor, progress) {
  // Здесь можно использовать библиотеку color-interpolate или реализовать самостоятельно
  // Упрощенная реализация для RGB цветов в формате hex
  // В реальном приложении используйте специализированную библиотеку
  // return mixColors(fromColor, toColor, progress);
}

export const gradientStore = new GradientStore();
