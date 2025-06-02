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
  animations = {};
  parallelGradientSystem = null;

  constructor() {
    makeAutoObservable(this, { calculateTheme: action, setUIStore: action });

    // Initialize parallel gradient system for complex themes
    this.parallelGradientSystem = new ParallelGradientSystem();

    // Initialize theme controller after a small delay to ensure core is ready
    setTimeout(() => {
      this.themeController = core.createController(
        "mainThemeController",
        this.getTheme,
        { config: core.getAnimationPreset("ultraSpring") },
      );
    }, 0);
    this.themesInit();
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
    if (!this.uiStore) return this.getStandardizedTheme({});

    const selectedThemeIndex =
      this.selectedThemes[this.uiStore.themeIsDark ? 0 : 1];
    const theme = this.uiStore.themeIsDark
      ? this.preparedDarkThemes[selectedThemeIndex]
      : this.preparedLightThemes[selectedThemeIndex];

    // Fallback to default themes if not calculated yet
    if (!theme) {
      const fallback = this.uiStore.themeIsDark
        ? this.darkCubehelixMode
        : this.lightCubehelixMode;
      return this.getStandardizedTheme({
        ...fallback,
        bWG: this.blackWhiteGradient,
      });
    }

    return this.getStandardizedTheme({
      ...theme,
      bWG: this.blackWhiteGradient,
    });
  }

  get darkCubehelixMode() {
    // alert(
    //   JSON.stringify(
    //     this.linearAngleGradientCubehelix(225, 0.2, 1, 0.01, 0.09, 64, 135),
    //   ),
    // );
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
        64,
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
        64,
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
      64,
      0,
    );
  }

  setUIStore = (store) => {
    this.uiStore = store;
  };

  // Standardize theme structure to prevent react-spring interpolation errors
  getStandardizedTheme = (theme) => {
    const standardNavButtons = [
      "#10CCDD",
      "#4079ff",
      "#99FFFF",
      "#0000ff",
      "#1050CC",
    ];
    const standardActiveButtons = [
      "#FFFF00",
      "#FFFF99",
      "#CCCCCC",
      "#FFFF00",
      "#FFFFDD",
    ];

    return {
      color: theme.color || "oklch(0.5 0 0)",
      accentColor: theme.accentColor || "oklch(0.5 0.1 0)",
      boxShadow: theme.boxShadow || "2px 1px rgba(0, 0, 0, 0.1)",
      background:
        theme.background ||
        "linear-gradient(0deg in oklch, oklch(0.5 0 0), oklch(0.7 0 0))",
      navBarButtonBackground:
        theme.navBarButtonBackground ||
        "linear-gradient(0deg in oklch, oklch(0.3 0 0), oklch(0.5 0 0))",
      buttonStartColor: theme.buttonStartColor || "#000000",
      buttonStopColor: theme.buttonStopColor || "#ffffff",
      // Standardize arrays to prevent interpolation errors
      navBarButtonText:
        Array.isArray(theme.navBarButtonText) &&
        theme.navBarButtonText.length === 5
          ? theme.navBarButtonText
          : standardNavButtons,
      navBarActiveButtonText:
        Array.isArray(theme.navBarActiveButtonText) &&
        theme.navBarActiveButtonText.length === 5
          ? theme.navBarActiveButtonText
          : standardActiveButtons,
      bWG:
        theme.bWG ||
        "linear-gradient(0deg in oklch, oklch(0 0 0), oklch(1 0 0))",
    };
  };

  // Safe animation wrapper to prevent react-spring errors
  animateThemeSafely = (newTheme) => {
    if (!this.themeController) return;

    try {
      // Get current and new standardized themes
      const currentTheme = this.getStandardizedTheme(this.getTheme);
      const targetTheme = this.getStandardizedTheme(newTheme);

      // Only animate safe properties (no arrays)
      const safeCurrentTheme = {
        color: currentTheme.color,
        accentColor: currentTheme.accentColor,
        boxShadow: currentTheme.boxShadow,
        background: currentTheme.background,
        navBarButtonBackground: currentTheme.navBarButtonBackground,
        buttonStartColor: currentTheme.buttonStartColor,
        buttonStopColor: currentTheme.buttonStopColor,
        bWG: currentTheme.bWG,
      };

      const safeTargetTheme = {
        color: targetTheme.color,
        accentColor: targetTheme.accentColor,
        boxShadow: targetTheme.boxShadow,
        background: targetTheme.background,
        navBarButtonBackground: targetTheme.navBarButtonBackground,
        buttonStartColor: targetTheme.buttonStartColor,
        buttonStopColor: targetTheme.buttonStopColor,
        bWG: targetTheme.bWG,
      };

      this.themeController.start({
        ...safeTargetTheme,
        config: core.getAnimationPreset("ultraSpring"),
      });
    } catch (error) {
      logger.error("Theme animation failed:", error);
      // Fallback: update without animation
      this.themeController.set(this.getStandardizedTheme(newTheme));
    }
  };

  calculateTheme = (themeType, themeIndex) => {
    const isDark = themeType === DARK;
    const targetArray = isDark
      ? this.preparedDarkThemes
      : this.preparedLightThemes;
    const storageKey = `theme_${isDark ? "dark" : "light"}_${themeIndex}`;

    let calculatedTheme;

    switch (themeIndex) {
      case 0:
        calculatedTheme = isDark
          ? this.darkCubehelixMode
          : this.lightCubehelixMode;
        break;
      case 1:
        calculatedTheme = this.getColorTheme(
          isDark ? STANDART_DARK : STANDART_LIGHT,
        );
        break;
      case 2:
        // Advanced gradients using enhanced algorithms
        calculatedTheme = this.generateAdvancedGradientTheme(isDark);
        break;
      case 3:
        // User custom themes with complex gradients
        calculatedTheme = this.generateCustomComplexTheme(isDark);
        break;
      case 4:
        // Generated themes with mega gradient system
        calculatedTheme = this.generateMegaGradientTheme(isDark);
        break;
      default:
        calculatedTheme = this.getColorTheme(
          isDark ? STANDART_DARK : STANDART_LIGHT,
        );
        break;
    }

    targetArray[themeIndex] = calculatedTheme;
    this.saveThemeToStorage(storageKey, calculatedTheme);
    logger.info(`Theme calculated and saved: ${storageKey}`);

    return calculatedTheme;
  };

  themesInit() {
    // Load themes from localStorage first
    this.loadThemesFromStorage();

    // Set up worker for lazy theme calculation
    this.themesWorker = setInterval(() => {
      // Check if any themes need calculation
      let hasWork = false;

      this.preparedDarkThemes.forEach((theme, index) => {
        if (theme === null) {
          this.calculateTheme(DARK, index);
          hasWork = true;
          return false; // Break after first calculation per cycle
        }
      });

      if (!hasWork) {
        this.preparedLightThemes.forEach((theme, index) => {
          if (theme === null) {
            this.calculateTheme(LIGHT, index);
            hasWork = true;
            return false; // Break after first calculation per cycle
          }
        });
      }

      // Stop worker when all themes are calculated
      if (!hasWork) {
        clearInterval(this.themesWorker);
        this.themesWorker = null;
        logger.info("All themes calculated, worker stopped");
      }
    }, 1000); // Check every second instead of 2 seconds

    this.setupReactions();
  }

  scaleGradient = (colors, number = 64) =>
    chroma.bezier(colors).scale().mode("oklch").colors(number).join(", ");

  circleGradient = (colors, number = 64, angle, angleTwo) =>
    `radial-gradient(in oklch circle at ${angle}% ${angleTwo}%, ${this.scaleGradient(colors, number)})`;

  linearAngleGradient = (colors, number = 64, angle) =>
    `linear-gradient( ${angle}deg in oklch, ${this.scaleGradient(colors, number)})`;

  linearAngleGradientCubehelix = (
    start,
    rotations,
    gamma,
    lightnessStart,
    lightnessEnd,
    number = 64,
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

  // localStorage integration
  saveThemeToStorage = (key, theme) => {
    try {
      localStorage.setItem(key, JSON.stringify(theme));
    } catch (error) {
      logger.warn("Failed to save theme to storage:", error);
    }
  };

  loadThemeFromStorage = (key) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      logger.warn("Failed to load theme from storage:", error);
      return null;
    }
  };

  loadThemesFromStorage = () => {
    for (let i = 0; i < 5; i++) {
      const darkTheme = this.loadThemeFromStorage(`theme_dark_${i}`);
      const lightTheme = this.loadThemeFromStorage(`theme_light_${i}`);

      if (darkTheme) {
        this.preparedDarkThemes[i] = darkTheme;
      }
      if (lightTheme) {
        this.preparedLightThemes[i] = lightTheme;
      }
    }

    logger.info("Themes loaded from storage");
  };

  // Method to recalculate and save specific theme
  recalculateTheme = (themeType, themeIndex) => {
    const targetArray =
      themeType === DARK ? this.preparedDarkThemes : this.preparedLightThemes;
    targetArray[themeIndex] = null; // Mark for recalculation
    return this.calculateTheme(themeType, themeIndex);
  };

  // Method to switch theme
  switchTheme = (themeIndex) => {
    if (themeIndex < 0 || themeIndex >= 5) return;

    const currentThemeType = this.uiStore?.themeIsDark ? 0 : 1;
    this.selectedThemes[currentThemeType] = themeIndex;

    // Save selection to storage
    localStorage.setItem("selectedThemes", JSON.stringify(this.selectedThemes));

    // Trigger animation if controller is ready
    if (this.themeController) {
      this.animateThemeSafely(this.getTheme);
    }
  };

  // Advanced theme generation methods using enhanced algorithms
  generateAdvancedGradientTheme = (isDark) => {
    const baseHue = isDark ? 240 : 60;
    const colors = [
      chroma.oklch(isDark ? 0.3 : 0.8, 0.15, baseHue).hex(),
      chroma.oklch(isDark ? 0.2 : 0.9, 0.1, baseHue + 120).hex(),
      chroma.oklch(isDark ? 0.4 : 0.7, 0.2, baseHue + 240).hex(),
      chroma.oklch(isDark ? 0.25 : 0.85, 0.12, baseHue + 60).hex(),
    ];

    const buttonColors = colors.map((c) => chroma(c).alpha(0.7).hex());

    return {
      color: isDark ? "oklch(0.95 0.05 240)" : "oklch(0.15 0.05 60)",
      accentColor: isDark ? "oklch(0.75 0.2 260)" : "oklch(0.55 0.2 80)",
      boxShadow: isDark
        ? "2px 1px rgba(100, 150, 200, 0.1)"
        : "2px 1px rgba(200, 150, 100, 0.15)",
      background: this.circleGradient(colors, 64, 25, 75),
      navBarButtonBackground: this.circleGradient(buttonColors, 64, 50, 50),
      buttonStartColor: buttonColors[0],
      buttonStopColor: buttonColors[buttonColors.length - 1],
      navBarButtonText: isDark
        ? ["#70C0FF", "#90A0FF", "#B0FFFF", "#6080FF", "#8090FF"]
        : ["#2060AA", "#4070BB", "#1050AA", "#3060BB", "#2050AA"],
      navBarActiveButtonText: isDark
        ? ["#FFFF80", "#FFFF90", "#FFFFAA", "#FFFF80", "#FFFFBB"]
        : ["#FF6600", "#DD5500", "#FFAA00", "#CC6600", "#BB4400"],
    };
  };

  generateCustomComplexTheme = (isDark) => {
    // Generate harmonious colors using golden ratio
    const baseHue = (Date.now() * 0.618034) % 360; // Golden ratio for harmony
    const colors = Array.from({ length: 5 }, (_, i) =>
      chroma
        .oklch(
          isDark ? 0.2 + i * 0.08 : 0.9 - i * 0.08,
          0.1 + i * 0.03,
          (baseHue + i * 72) % 360, // Pentagon harmony
        )
        .hex(),
    );

    return {
      color: isDark
        ? `oklch(0.95 0.03 ${baseHue})`
        : `oklch(0.1 0.03 ${baseHue})`,
      accentColor: chroma
        .oklch(isDark ? 0.7 : 0.5, 0.2, (baseHue + 180) % 360)
        .css(),
      boxShadow: `2px 1px ${chroma(colors[0]).alpha(0.1).css()}`,
      background: this.linearAngleGradient(colors, 64, (baseHue / 2) % 360),
      navBarButtonBackground: this.circleGradient(colors, 64, 33, 67),
      buttonStartColor: colors[0],
      buttonStopColor: colors[4],
      navBarButtonText: colors.slice(0, 5).map((c) =>
        chroma(c)
          .darken(isDark ? -1 : 2)
          .hex(),
      ),
      navBarActiveButtonText: colors.slice(0, 5).map((c) =>
        chroma(c)
          .brighten(isDark ? 1 : -1)
          .hex(),
      ),
    };
  };

  generateMegaGradientTheme = (isDark) => {
    // Create complex multi-layered gradient system
    const seedHue = (Date.now() * 0.381966) % 360; // Another mathematical constant
    const colors = [];

    // Generate 8 harmonious colors using various mathematical relationships
    for (let i = 0; i < 8; i++) {
      const hue = (seedHue + i * 45) % 360; // Octagon harmony
      const lightness = isDark
        ? 0.15 + (Math.sin((i * Math.PI) / 4) + 1) * 0.15
        : 0.75 + (Math.cos((i * Math.PI) / 4) + 1) * 0.15;
      const chroma_val = 0.08 + (i % 3) * 0.04;

      colors.push(chroma.oklch(lightness, chroma_val, hue).hex());
    }

    const dominantColor = chroma.oklch(isDark ? 0.4 : 0.7, 0.15, seedHue);

    return {
      color: isDark ? "oklch(0.95 0.02 0)" : "oklch(0.05 0.02 0)",
      accentColor: dominantColor.css(),
      boxShadow: `2px 1px ${dominantColor.alpha(0.15).css()}`,
      background: this.circleGradient(colors, 64, 50, 50),
      navBarButtonBackground: this.linearAngleGradient(
        colors.slice(0, 5),
        64,
        135,
      ),
      buttonStartColor: colors[0],
      buttonStopColor: colors[4],
      navBarButtonText: Array.from({ length: 5 }, (_, i) =>
        chroma.oklch(isDark ? 0.8 : 0.3, 0.1, (seedHue + i * 72) % 360).hex(),
      ),
      navBarActiveButtonText: Array.from({ length: 5 }, (_, i) =>
        chroma
          .oklch(isDark ? 0.95 : 0.15, 0.15, (seedHue + i * 72 + 36) % 360)
          .hex(),
      ),
    };
  };

  // Cache management methods
  clearThemeCache = () => {
    try {
      for (let i = 0; i < 5; i++) {
        localStorage.removeItem(`theme_dark_${i}`);
        localStorage.removeItem(`theme_light_${i}`);
      }

      this.preparedDarkThemes = [null, null, null, null, null];
      this.preparedLightThemes = [null, null, null, null, null];

      if (this.parallelGradientSystem) {
        this.parallelGradientSystem.dispose();
        this.parallelGradientSystem = new ParallelGradientSystem();
      }

      logger.info("Theme cache cleared successfully");
    } catch (error) {
      logger.error("Failed to clear theme cache:", error);
    }
  };

  getThemeCacheInfo = () => {
    const info = {
      darkThemes: this.preparedDarkThemes.map((theme, i) => ({
        index: i,
        cached: theme !== null,
        inStorage: !!localStorage.getItem(`theme_dark_${i}`),
      })),
      lightThemes: this.preparedLightThemes.map((theme, i) => ({
        index: i,
        cached: theme !== null,
        inStorage: !!localStorage.getItem(`theme_light_${i}`),
      })),
      selectedThemes: this.selectedThemes,
      workerActive: !!this.themesWorker,
      parallelSystemActive: !!this.parallelGradientSystem,
    };

    return info;
  };

  setupReactions() {
    // Load selected themes from storage
    try {
      const storedSelection = localStorage.getItem("selectedThemes");
      if (storedSelection) {
        this.selectedThemes = JSON.parse(storedSelection);
      }
    } catch (error) {
      logger.warn("Failed to load theme selection:", error);
    }

    reaction(
      () => this.uiStore?.themeIsDark,
      (isDark) => {
        logger.info(`Theme changed to: ${isDark ? "dark" : "light"}`);

        const startAnimation = () => {
          if (this.themeController) {
            logger.debug("Starting theme animation");
            this.animateThemeSafely(this.getTheme);
          }
        };

        if (!this.themeController) {
          // Wait for controller to be initialized
          logger.debug("Waiting for theme controller initialization");
          const checkController = () => {
            if (this.themeController) {
              startAnimation();
            } else {
              setTimeout(checkController, 50);
            }
          };
          checkController();
        } else {
          startAnimation();
        }
      },
      { fireImmediately: true },
    );
  }

  // setupReactions() {
  //  Реакция на изменение темы
  // logger.logJSON();
  // reaction(
  //   () => [this.uiStore?.themeIsDark],
  //   (isDark) => {
  // this.colorScheme = theme;
  // if (this.uiStore.appkitMethods?.setThemeMode) {
  //   this.uiStore.appkitMethods.setThemeMode(theme);
  // }
  // logger.info(theme);

  // configs: {
  //   background: { tension: 120, friction: 14 },
  //   shadowOpacity: { tension: 300, friction: 10 },
  // },
  // });
  // logger.colorLog(
  //   this.getTheme.color,
  //   this.getTheme.accentColor,
  //   this.getTheme.color,
  //   this.getTheme.accentColor,
  // );
  // localStorage.setItem("app-color-scheme", theme);
  // },
  // { fireImmediately: true },
  // );
  // when(
  //   () => this.uiStore.appkitMethods?.setThemeMode !== null,
  //   () => {
  //     // Принудительно обновляем/ тему
  //     // после загрузки        appkitЕруьу
  //     this.uiStore.appkitMethods.setThemeMode(this.uiStore.themeIsDark);
  //     logger.success("appkitMethods", "end");
  //   },
  // );
  // }

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
