import { action, makeAutoObservable } from "mobx";
import { animation } from "@stores/animation.js";

class UiStore {
  colorScheme = "dark"; // Начальное значение
  isNavbarOpened = false;
  fontSearch = "";
  fontFamilies = [];
  searchFontFamilies = [];
  appkitMethods = {};

  constructor() {
    makeAutoObservable(this, {
      toggleNavbarOpened: action,
      setFontSearch: action,
      setNavbarInterval: action,
      toggleColorScheme: action,
      setColorScheme: action,
    });
  }

  get themeIsDark() {
    return this.colorScheme === "dark";
  }
  get themeStyle() {
    return {...animation.themeController.springs};
  }

  setAppkitMethods = (appkitMethods) => {
    this.appkitMethods = appkitMethods;
    appkitMethods.setThemeMode(this.themeIsDark ? "dark" : "light");
    appkitMethods.setThemeVariables({
      "--w3m-font-family": "SF Pro Rounded",
      "--w3m-accent": "oklch(0.55 0.2506 263.2047 /100)",
      "--w3m-color-mix-strength": 300,
    });
  };

  setColorScheme = (theme) => {
    this.colorScheme = theme;
    this.appkitMethods.setThemeMode(theme);
    animation.themeController.start({
      ...animation.theme,
    });
    localStorage.setItem("my-app-color-scheme", theme);
  };

  setFontFamilies = (value) => {
    this.fontFamilies = value;
    this.searchFontFamilies = [...value];
  };

  toggleNavbarOpened = () => {
    const navBarMoving = animation.getMCAnimation("NavBarMoving");
    navBarMoving.control.start(this.isNavbarOpened ? "visible" : "hidden");
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
