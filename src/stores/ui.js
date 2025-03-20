import { action, makeAutoObservable } from "mobx";

class UiStore {
  constructor() {
    makeAutoObservable(this, {
      toggleNavbarOpened: action,
      setFontSearch: action,
      setNavbarInterval: action,
      toggleColorScheme: action,
    });
  }

  colorScheme = "dark"; // Начальное значение




  setColorScheme(scheme) {
    this.colorScheme = scheme;
    localStorage.setItem("my-app-color-scheme", scheme);
  }

  get themeIsDark() {
   return this.colorScheme === "dark"
  }

  toggleColorScheme = () => {
    // Добавляем метод для переключения
    this.setColorScheme(this.colorScheme === "dark" ? "light" : "dark");
  };

  isNavbarOpened = true;
  fontSearch = "";
  fontFamilies = [];
  searchFontFamilies = [];
  navbarInterval = null;

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
