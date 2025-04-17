import { action, makeAutoObservable } from "mobx";
import { animation } from "@stores/animation.js";

class UiStore {
  colorScheme = "dark"; // Начальное значение
  isNavbarOpened = false;
  fontSearch = "";
  fontFamilies = [];
  searchFontFamilies = [];

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

  setColorScheme = (theme) => {
    this.colorScheme = theme;

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
