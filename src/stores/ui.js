import { action, makeAutoObservable } from "mobx";

class UiStore {
  colorScheme = "dark"; // Начальное значение
  themeBackGround = "black"; // Начальное значение
  isNavbarOpened = true;
  fontSearch = "";
  fontFamilies = [];
  searchFontFamilies = [];
  navbarInterval = null;

  constructor() {
    makeAutoObservable(this, {
      toggleNavbarOpened: action,
      setFontSearch: action,
      setNavbarInterval: action,
      toggleColorScheme: action,
    });
  }

  get themeIsDark() {
    return this.colorScheme === "dark";
  }

  setColorScheme(scheme) {
    this.colorScheme = scheme;
    localStorage.setItem("my-app-color-scheme", scheme);
  }

  toggleColorScheme = () => {
    // Добавляем метод для переключения
    this.setColorScheme(this.colorScheme === "dark" ? "light" : "dark");
  };

  setNavbarInterval = (value) => {
    this.navbarInterval = value;
  };

  setFontFamilies = (value) => {
    this.fontFamilies = value;
    this.searchFontFamilies = [...value];
  };

  toggleNavbarOpened = () => (this.isNavbarOpened = !this.isNavbarOpened);

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
