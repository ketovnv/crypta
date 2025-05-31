import { action, makeAutoObservable, reaction, when } from "mobx";
import chroma from "chroma-js";
import {
  RAINBOWGRADIENT,
  RAINBOWV2GRADIENT,
  redGradientDark,
  redGradientLight,
  STANDART_DARK,
  STANDART_LIGHT,
} from "./gradientColors";
import { logger } from "@stores/logger.js";
import { core, ANIMATION_PRESETS } from "./core.js";

const DARK = 0;
const LIGHT = 1;

class GradientStore {
  uiStore = null;
  themesWorker = null;
  themeController = null;
  preparedDarkThemes = [0, 1, 2, 3, 4];
  preparedLightThemes = [0, 1, 2, 3, 4];
  selectedThemes = [0, 0];
  animations = {};

  constructor() {
    makeAutoObservable(this, { calculateTheme: action, setUIStore: action });
    // createSmartController(
    //   "mainThemeController",
    //   this.getTheme,
    //   "smart",c
    //   (api) => (this.animations[api.name] = api),
    //   {
    //     tension: 50,
    //     friction: 75,
    //     mass: 5,
    //     damping: 100,
    //     precision: 0.0001,
    //   },
    // );

    setTimeout(
      () =>
        (this.themeController = core.createController(
          "mainThemeController",
          this.getTheme,
          ANIMATION_PRESETS.ultraSpring,
        )),
      0,
    );
    false && this.themesInit();
  }

  get getRainbowV2Gradient() {
    return RAINBOWV2GRADIENT;
  }

  get getRainbowGradient() {
    return RAINBOWGRADIENT;
  }

  get animatedTheme() {
    return this.themeController?.springs;
  }

  get getTheme() {
    if (!this.uiStore) return {};
    // const theme = uiStore.themeIsDark ? this.darkCubehelixMode : this.lightCubehelixMode
    const theme = this.getColorTheme(
      this.uiStore.themeIsDark ? STANDART_DARK : STANDART_LIGHT,
    );
    // uiStore.setThemeIsVeryColorised(!!theme.themeIsVeryColorised)
    return { ...theme, bWG: this.blackWhiteGradient };
  }

  get darkCubehelixMode() {
    return {
      color: "oklch(0.95 0.05 149.29)",
      accentColor: "oklch(0.89 0.2631 111.18)",
      boxShadow: "2px 1px rgba(25, 100, 50, 0.05)",
      background: this.linearAngleGradientCubehelix(
        225,
        0.2,
        1,
        0.01,
        0.09,
        64,
        135,
      ),
      navBarButtonBackground: this.linearAngleGradientCubehelix(
        275,
        0.2,
        0.9,
        0.08,
        0.1,
        32,
        125,
      ),
      navBarButtonText: ["#10CCDD", "#4079ff", "#99FFFF", "#0000ff", "#1050CC"],
      navBarActiveButtonText: [
        "#FFFF00",
        "#FFFF99",
        "#CCCCCC",
        "#FFFF00",
        "#FFFFDD",
      ],
      // themeIsVeryColorised:true
    };
  }

  get lightCubehelixMode() {
    return {
      color: "oklch(0.01 0 0)",
      accentColor: "oklch(0.42 0.2086 263.9)",
      boxShadow: "2px 1px rgba(0, 0, 0, 0.15)",
      background: this.linearAngleGradientCubehelix(
        225,
        0.2,
        0.5,
        0.4,
        0.7,
        64,
        125,
      ),
      navBarButtonBackground: this.circleGradient(
        ["#f0Daa0", "#F9F9DD", "#fafa99", "#FFFFED"],
        12,
        0,
        250,
      ),
      navBarButtonText: ["#000055", "#4079ff", "#0525FF", "#0000ff", "#1050CC"],
      navBarActiveButtonText: [
        "#FF5500",
        "#CC5500",
        "#FFEE00",
        "#BB7700",
        "#771100",
      ],
      // themeIsVeryColorised:true
    };
  }

  get getRedGradient() {
    return this.uiStore.themeIsDark ? redGradientDark : redGradientLight;
  }

  get blackWhiteGradient() {
    return this.linearAngleGradient(
      this.uiStore.themeIsDark
        ? ["oklch(1 0 0)", "oklch(0 0 0)"]
        : ["oklch(0 0 0)", "oklch(1 0 0)"],
      4,
      0,
    );
  }

  setUIStore = (store) => (this.uiStore = store);

  calculateTheme = (lightness, theme) => {
    const calculate = (content) =>
      lightness > 0
        ? (this.preparedDarkThemes = content)
        : (this.preparedLightThemes = content);

    switch (theme) {
      case 0:
        calculate(
          this.getColorTheme(lightness > 0 ? STANDART_LIGHT : STANDART_DARK),
        );
        break;
      case 1:
        calculate(
          lightness > 0 ? this.lightCubehelixMode : this.darkCubehelixMode,
        );
        break;
      case 2:
        calculate(
          this.getColorTheme(lightness > 0 ? STANDART_LIGHT : STANDART_DARK),
        );
        break;
      case 3:
        calculate(
          this.getColorTheme(lightness > 0 ? STANDART_LIGHT : STANDART_DARK),
        );
        break;
      case 4:
        calculate(
          this.getColorTheme(lightness > 0 ? STANDART_LIGHT : STANDART_DARK),
        );
        break;
      default:
        calculate(
          this.getColorTheme(lightness > 0 ? STANDART_LIGHT : STANDART_DARK),
        );
        break;
    }
  };

  themesInit() {
    this.selectedThemes.forEach((theme, index) =>
      this.calculateTheme(index, theme),
    );

    logger.logJSON("preparedDarkThemes", this.preparedDarkThemes);
    this.themesWorker =
      false &&
      setInterval(() => {
        this.preparedDarkThemes.every((theme) => {
          if (theme.color) return true;
          console.log("preparedDarkThemes2", this.preparedDarkThemes);
          logger.logJSON("preparedLightThemes2", this.preparedLightThemes);
          this.calculateTheme(DARK, theme);
          return false;
        });

        logger.logJSON("preparedLightThemes", this.preparedLightThemes);
        this.preparedLightThemes.forEach((theme) => {
          if (theme.color) return true;
          console.log("preparedLightThemes2", this.preparedLightThemes);
          this.calculateTheme(LIGHT, theme);
          return false;
        });
        this.setupReactions();
      }, 2000);
  }

  scaleGradient = (colors, number) =>
    chroma.bezier(colors).scale().mode("oklch").colors(number).join(", ");

  circleGradient = (colors, number, angle, angleTwo) =>
    `radial-gradient(in oklch circle at ${angle}% ${angleTwo}%, ${this.scaleGradient(colors, number)})`;

  linearAngleGradient = (colors, number, angle) =>
    `linear-gradient( ${angle}deg in oklch, ${this.scaleGradient(colors, number)})`;

  linearAngleGradientCubehelix = (
    start,
    rotations,
    gamma,
    lightnessStart,
    lightnessEnd,
    number,
    angle,
  ) =>
    `linear-gradient( ${angle}deg in oklch, ${this.scaleCubehelix(start, rotations, gamma, lightnessStart, lightnessEnd, number)})`;

  // getThemeMeta(themeName) {
  //     // const {color, background} = this.getColorTheme(this.darkCubehelixMode)
  //
  //     // logger.logJSON('👻👻👻👻👻👻',(logger.whatIs(this.darkCubehelixMode))
  //
  //     return  this.lightCubehelixMode.background    }

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
      .scale() // convert to chroma.scale
      .correctLightness()
      .colors(number);

  averageOklch = (colors) => chroma.average(colors, "oklch");

  averageHex = (colors) => chroma.average(colors, "hex");

  chromaSpectral = () => chroma.scale("Spectral").domain([1, 0]);

  getColorTheme = (theme) => {
    return {
      color: theme.c,
      accentColor: theme.c,
      boxShadow: theme.bs,
      background: this.circleGradient(
        theme.bg[0],
        theme.bg[1],
        theme.bg[2],
        theme.bg[3],
      ),
      // background: 'transparent',
      navBarButtonBackground: this.circleGradient(
        theme.nbbb[0],
        theme.nbbb[1],
        theme.nbbb[2],
        theme.nbbb[3],
      ),
      buttonStartColor: theme.nbbb[0][0],
      buttonStopColor: theme.nbbb[0][3],
      navBarButtonText: theme.nbbt,
      navBarActiveButtonText: theme.nbabt,
    };
  };

  setupReactions() {
    //  Реакция на изменение темы
    reaction(
      () => [this.uiStore?.themeIsDark],
      ([theme]) => {
        this.colorScheme = theme;
        // if (this.uiStore.appkitMethods?.setThemeMode) {
        //   this.uiStore.appkitMethods.setThemeMode(theme);
        // }

        this.themeController.start({
          ...this.theme,
          config: {
            ...this.settings.ultraSpring,
          },
          configs: {
            background: { tension: 120, friction: 14 },
            shadowOpacity: { tension: 300, friction: 10 },
          },
        });
        logger.success("themeController", "end");
        localStorage.setItem("app-color-scheme", theme);
      },
      { fireImmediately: true },
    );
    // when(
    //   () => this.uiStore.appkitMethods?.setThemeMode !== null,
    //   () => {
    //     // Принудительно обновляем/ тему
    //     // после загрузки        appkitЕруьу
    //     this.uiStore.appkitMethods.setThemeMode(this.uiStore.themeIsDark);
    //     logger.success("appkitMethods", "end");
    //   },
    // );
  }

  // Методы для градиентов
  // createGradient(name, colorStops, type = "linear") {
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
  // }
}

export const gradientStore = new GradientStore();
// export const SVGNoiseFilter = () => (
//     <svg className="hidden">
//       <defs>
//         <filter id="noise">
//           <feTurbulence
//               type="fractalNoise"
//               baseFrequency="0.65"
//               numOctaves="3"
//               stitchTiles="stitch"
//           />
//           <feColorMatrix type="saturate" values="0" />
//         </filter>
//
//         <filter id="fluid">
//           <feTurbulence baseFrequency="0.02" numOctaves="3" />
//           <feDisplacementMap in="SourceGraphic" scale="15" />
//         </filter>
//
//         <filter id="glow">
//           <feGaussianBlur stdDeviation="3" result="coloredBlur" />
//           <feMerge>
//             <feMergeNode in="coloredBlur" />
//             <feMergeNode in="SourceGraphic" />
//           </feMerge>
//         </filter>
//       </defs>
//     </svg>
// );
