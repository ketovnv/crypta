import {action, makeAutoObservable} from "mobx";
import {animation} from "./animation";

class UiStore {

  colorScheme = "dark";
  themeIsVeryColorised = false// Начальное значение
  isNavbarOpened = false;
  fontSearch = "";
  fontFamilies = [];
  searchFontFamilies = [];
  appkitMethods = {};
  screenHeight = 0;
  screenWidth = 0;

  get getRed() {
    return  `oklch${this.themeIsDark ?'(0.65 0.242 32.37)' : '(0.39 0.1423 32.37)'}`
  }

  get getGreen() {
    return  `oklch(${this.themeIsDark ? 0.9 : 0.5} 0.166 147.29)`
  }
  get getTthemeIsVeryColorised() {
    return this.themeIsVeryColorised  }

  constructor() {
    makeAutoObservable(this, {
      toggleNavbarOpened: action,
      setFontSearch: action,
      setNavbarInterval: action,
      toggleColorScheme: action,
      setColorScheme: action,
      setScreenHeight: action,
      setScreenWidth: action,
      setThemeIsVeryColorised: action,

    });
  }

  get themeIsDark() {
    return this.colorScheme === "dark";
  }
  get themeStyle() {
    return {...animation.themeController.springs};
  }

  get screenSize() {
    return {height: this.screenHeight, width: this.screenWidth}
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
  setScreenHeight = (value) => this.screenHeight = value;
  setScreenWidth = (value) => this.screenWidth = value;
  setThemeIsVeryColorised = (value) => this.themeIsVeryColorised = value;


  setColorScheme = (theme) => {
    this.colorScheme = theme;
    this.appkitMethods.setThemeMode(theme);
    animation.themeController.start({
      ...animation.theme,
      config: {
        tension: 50,
        friction: 75,
        mass: 10,
        damping: 75,
        precision: 0.0001,
      },
    });
    localStorage.setItem("app-color-scheme", theme);
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
