import {action, makeAutoObservable} from "mobx";
import {animation} from "@stores/animation.js";

const darkTheme = [
    "#C1C2C5", // 0
    "#A6A7AB", // 1
    "#909296", // 2
    "#5C5F66", // 3
    "#373A40", // 4
    "#2C2E33", // 5
    "#25262B", // 6
    "#1A1B1E", // 7
    "#141517", // 8
    "#101113", // 9
];

class UiStore {
    colorScheme = "dark"; // Начальное значение
    themeBackGround = "black"; // Начальное значение
    isNavbarOpened = false;
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

    toggleNavbarOpened = () => {
        const navBarMoving = animation.getMCAnimation('NavBarMoving')
        navBarMoving.control.start(this.isNavbarOpened ? "visible" : "hidden")
        this.isNavbarOpened = !this.isNavbarOpened
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
