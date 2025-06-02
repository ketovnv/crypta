import { action, makeAutoObservable, reaction } from "mobx";
import { gradientStore } from "./gradient";
import { logger } from "@stores/logger.js";
import nBMParams from "../animations/configs/navBarMoving.json";

const APP_NAME = "ReactApproveAppkit";
const appNameArray = APP_NAME.split("");

class UiStore {
  colorScheme = "dark";
  appNameIsHover = false;
  themeIsVeryColorised = false; // Начальное значение
  isNavbarOpened = false;
  fontSearch = "";
  fontFamilies = [];
  searchFontFamilies = [];
  withFooter = true;
  appkitMethods = {
    setThemeMode: null,
    setThemeVariables: null,
  };
  screenHeight = 0;
  screenWidth = 0;

  constructor() {
    makeAutoObservable(this, {
      toggleNavbarOpened: action,
      setFontSearch: action,
      setNavbarInterval: action,
      toggleColorScheme: action,
      setColorScheme: action,
      // setScreenHeight: action,
      // setScreenWidth: action,
      setAppkitMethods: action,
      setThemeIsVeryColorised: action,
    });
    gradientStore.setUIStore(this);
  }

  get getAppNameArray() {
    return appNameArray;
  }

  get theme() {
    return { ...gradientStore.getTheme };
  }

  get getAppNameIsHover() {
    return this.appNameIsHover;
  }

  get isNbOpen() {
    return this.isNavbarOpened;
  }

  get getRed() {
    return `oklch${this.themeIsDark ? "(0.65 0.242 32.37)" : "(0.39 0.1423 32.37)"}`;
  }

  get getGreen() {
    return `oklch(${this.themeIsDark ? 0.9 : 0.5} 0.166 147.29)`;
  }

  get getTthemeIsVeryColorised() {
    return this.themeIsVeryColorised;
  }

  get themeIsDark() {
    console.log(this.colorScheme === "dark" ? "⚫" : "⚪");
    return this.colorScheme === "dark";
  }

  get themeStyle() {
    return { ...core.themeController.springs };
  }

  get screenSize() {
    return { height: this.screenHeight, width: this.screenWidth };
  }

  get renderFooter() {
    return this.withFooter;
  }

  setAppNameIsHover = (isHover) => (this.appNameIsHover = isHover);

  /**
   * @param {{setThemeMode: {(themeMode: ThemeMode): void}; setThemeVariables: {(themeVariables: ThemeVariables): void}}} appkitMethods
   */
  setAppkitMethods = (appkitMethods) => {
    this.appkitMethods = appkitMethods;
    appkitMethods.setThemeMode(this.themeIsDark ? "dark" : "light");
    appkitMethods.setThemeVariables({
      "--w3m-font-family": "SF Pro Rounded",
      "--w3m-accent": "oklch(0.55 0.2506 263.2047 /100)",
      "--w3m-color-mix-strength": 300,
    });
  };

  setupReactions() {
    // Реакция на открытие/закрытие навбара
    reaction(
      () => [this.isNbOpen],
      (isOpen) => this.animateNavbarState(isOpen),
      { fireImmediately: true },
    );
  }

  // Продвинутые методы анимации
  async animateNavbarState(isOpened) {
    if (isOpened) {
      // Последовательная анимация открытия
      // await this.navigation.to({ opacity: 1, scale: 1 });
      // await this.page.to({ x: 250, scale: 1, y: 50 });
      logger.success("Навбар удачно анимировал открытие");
    } else {
      // Параллельная анимация закрытия
      await Promise.all([
        // this.navigation.to({ opacity: 0, x: -50, scale: 0.95 }),
        // this.page.to({ x: 225, scale: 1.7, y: -50 }),
      ]);
      logger.success("Навбар удачно анимировал закрытие");
    }
  }

  // setScreenHeight = (value) => (this.screenHeight = value);
  // setScreenWidth = (value) => (this.screenWidth = value);
  setThemeIsVeryColorised = (value) => (this.themeIsVeryColorised = value);

  setColorScheme = (theme) => {
    this.colorScheme = theme;
  };

  setFontFamilies = (value) => {
    this.fontFamilies = value;
    this.searchFontFamilies = [...value];
  };

  toggleNavbarOpened = () => {
    // const navBarMoving = animation.getMCAnimation("NavBarMoving");
    // navBarMoving.control.start(this.isNavbarOpened ? "visible" : "hidden");
    this.isNavbarOpened = !this.isNavbarOpened;
  };

  setFontSearch = (value) => {
    this.fontSearch = value;
    if (!this.fontSearch || this.fontSearch.length < 2) return;
    this.searchFontFamilies = this.fontFamilies.filter((fontFamily) =>
      fontFamily.toLowerCase().includes(this.fontSearch.toLowerCase()),
    );
  };

  getFontSearch = () => this.fontSearch;
}

export const uiStore = new UiStore();
