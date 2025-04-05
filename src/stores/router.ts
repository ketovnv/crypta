import {action, makeAutoObservable} from "mobx";

const ROUTES = {
    "Home": "Кошелёк",
    "Balance": "Баланс",
    "Approve": "Approve",
    "Transactions": "Транзакции",
    // "Options": "Настройки"
}

class RouterStore {
    currentPath: string = "Home"

    constructor() {
        makeAutoObservable(this);
    }

    get getCurrentPage() {
        return this.currentPath;
    }

    get getPages() {
        return Object.entries(ROUTES);
    }

    @action
    goTo(path: string) {
        if (this.currentPath === path) return;
        this.currentPath = path;
    }

}

export const router = new RouterStore();
