import {makeAutoObservable} from "mobx";
import chroma from "chroma-js";

class GradientStore {

  constructor() {
    makeAutoObservable(this);
  }

  get darkMode() {
    return {
      background: this.circleGradient(
          [
            "#040409",
            "#010207",
            "#000003",
            "#060809",
            "#010103",
            "#030305",
          ],
          32,
          10,
          27,
      ),
      navBarButtonBackground: this.circleGradient(
          ["#101210"
            , "#000001",
            "#081011",
            "#010203"
          ],
        12,
          100,
        50,
      ),
      navBarButtonText: [
        "#10CCDD",
        "#4079ff",
        "#99FFFF",
        "0000ff",
        "#1050CC"
      ],
      navBarActiveButtonText: [
        "#FFFF00",
        "#FFFF99",
        "#CCCCCC",
        "#FFFF00",
        "#FFFFDD"
      ],
    };
  }

  get lightMode() {
    return {
      background: this.circleGradient(
          [
            "#fFfaFF",
            "#FFFFEE",
            "#fafaCF",
            "#FFFFDD",
            "#FFFFCF",
            "#fafaFF",
          ],
        32,
          10,
          27,
      ),

      navBarButtonBackground: this.circleGradient(
          [
            "#f0Daa0",
            "#F9F9DD",
            "#fafa99",
            "#FFFFED"
          ],
        12,
        0,
        250,
      ),
      navBarButtonText: [
        "#000055",
        "#4079ff",
        "#0525FF",
        "0000ff",
        "#1050CC"
      ],
      navBarActiveButtonText: [
          "#FF5500",
          "#CC5500",
          "#FFEE00",
          "#BB7700",
          "#771100"
      ]
    };


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
