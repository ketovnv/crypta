import { makeAutoObservable } from "mobx";
import { useSpring } from "@react-spring/web";

// in oklab circle at -25% -270%
const lightStops = [
  { percent: 0, color: "#FFFFFF" },
  { percent: 5, color: "#EEEEEE" },
  { percent: 25, color: "#DDDDDD" },
  { percent: 45, color: "#D5D5D5" },
  { percent: 60, color: "#CCCCCC" },
  { percent: 70, color: "#BBBBBB" },
  { percent: 80, color: "#B5B5B5" },
  { percent: 90, color: "#AAAAAA" },
  { percent: 95, color: "#A5A5A5" },
];
const darkStops = [
  { percent: 0, color: "#888888" },
  { percent: 5, color: "#777777" },
  { percent: 25, color: "#666666" },
  { percent: 45, color: "#555555" },
  { percent: 60, color: "#333333" },
  { percent: 70, color: "#222222" },
  { percent: 80, color: "#111111" },
  { percent: 90, color: "#070707" },
  { percent: 95, color: "#010101" },
];

const darkMode =
  "radial-gradient(" +
  "         ," +
  "          #888888 0%," +
  "          #777777 5%," +
  "          #666666 25%," +
  "          #555555 45%," +
  "          #333333 60%," +
  "          #222222 70%," +
  "          #111111 80%," +
  "          #070707 90%," +
  "          #010101 95%" +
  "  )";

const lightMode =
  "radial-gradient(" +
  "         in oklab circle at 25% 270%," +
  "          #FFFFFF 0%," +
  "          #EEEEEE 5%," +
  "          #DDDDDD 25%," +
  "          #D5D5D5 45%," +
  "          #CCCCCC 60%," +
  "          #BBBBBB 70%," +
  "          #B5B5B5 80%," +
  "          #AAAAAA 90%," +
  "          #A5A5A5 95%" +
  "  )";

class GradientStore {
  gradients = {
    default: {
      colors: ["#ff9a9e", "#fad0c4"],
      angle: 45,
    },
    darkMode: {
      colors: ["#232526", "#414345"],
      angle: 90,
    },
    fire: {
      colors: ["#ff6a00", "#ee0979"],
      angle: 180,
    },
  };

  activeGradient = "default";

  constructor() {
    makeAutoObservable(this);
  }

  get themeGradients() {
    return { darkMode, lightMode };
  }

  get mainGradients() {
    return {
      light: { posX: 25, posY: 270, stops: lightStops },
      dark: { posX: -25, posY: -270, stops: darkStops },
    };
  }

  get gradientConfig() {
    return this.gradients[this.activeGradient];
  }

  get springGradient() {
    return useSpring({
      gradients: this.gradientConfig.colors,
      angle: this.gradientConfig.angle,
      config: { mass: 1, tension: 180, friction: 20 },
    });
  }

  setGradient(name) {
    if (this.gradients[name]) {
      this.activeGradient = name;
    }
  }

  // Существующие методы
  setMantineControlAnimation(newAnimation) {
    this.mantineControlAnimations = {
      ...this.mantineControlAnimations,
      ...newAnimation,
    };
  }

  setSpringAnimation(newAnimation) {
    this.springAnimations = { ...this.springAnimations, ...newAnimation };
  }

  // Новые методы для интерполяций
  createInterpolation(name, inputRange, outputRange, options = {}) {
    const interpolator = interpolate(inputRange, outputRange, options);
    this.interpolations[name] = interpolator;
    return interpolator;
  }

  getInterpolation(name, value) {
    if (!this.interpolations[name]) return value;
    return this.interpolations[name](value);
  }

  // Методы для градиентов
  createGradient(name, colorStops, type = "linear") {
    this.gradients[name] = {
      colorStops,
      type,
      getCSS: (angle = "90deg") => {
        if (type === "linear") {
          return `linear-gradient(${angle}, ${colorStops.join(", ")})`;
        } else if (type === "radial") {
          return `radial-gradient(circle, ${colorStops.join(", ")})`;
        }
        return "";
      },
    };
  }

  getGradient(name, options = {}) {
    if (!this.gradients[name]) return "";
    return this.gradients[name].getCSS(options.angle);
  }

  // Динамическое обновление градиента
  updateGradient(name, colorStops) {
    if (this.gradients[name]) {
      this.gradients[name].colorStops = colorStops;
    }
  }

  // Интерполяция между двумя градиентами
  interpolateGradients(name, fromGradientName, toGradientName, progress) {
    if (!this.gradients[fromGradientName] || !this.gradients[toGradientName])
      return;

    const fromColors = this.gradients[fromGradientName].colorStops;
    const toColors = this.gradients[toGradientName].colorStops;

    // Убедимся, что количество цветовых остановок совпадает
    if (fromColors.length !== toColors.length) return;

    // Интерполировать каждую цветовую остановку
    const interpolatedColors = fromColors.map((fromColor, index) => {
      // Здесь нужна функция interpolateColor, которую можно реализовать
      // с помощью color-interpolate или другой библиотеки
      return interpolateColor(fromColor, toColors[index], progress);
    });

    this.createGradient(
      name,
      interpolatedColors,
      this.gradients[fromGradientName].type,
    );
  }
}

// Вспомогательная функция для интерполяции цветов
function interpolateColor(fromColor, toColor, progress) {
  // Здесь можно использовать библиотеку color-interpolate или реализовать самостоятельно
  // Упрощенная реализация для RGB цветов в формате hex
  // В реальном приложении используйте специализированную библиотеку
  return mixColors(fromColor, toColor, progress);
}

export const gradientStore = new GradientStore();
