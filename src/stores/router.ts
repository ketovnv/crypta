// src/stores/RouterStore.ts
import { makeAutoObservable } from 'mobx';
import { NavigateFunction } from 'react-router';
import { AppRoutes, ROUTES, ROUTE_META, RouteMeta } from '../components/Pages/routes';

// Определяем возможные маршруты как константы


// Описываем мета-информацию для каждого маршрута


class RouterStore {
    currentPath = '/' as AppRoutes;
    previousPath = '/' as AppRoutes;
    isNavigating = false;
    private navigate: NavigateFunction | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    // Инициализация с react-router
    setNavigate(navigate: NavigateFunction) {
        this.navigate = navigate;
    }

    // Переход на новый маршрут с анимацией
    async navigateTo(path: AppRoutes) {
        if (this.currentPath === path || !this.navigate) return;

        this.isNavigating = true;
        this.previousPath = this.currentPath;
        this.currentPath = path;

        // Выполняем переход
        this.navigate(path);

        // Имитируем задержку для анимации
        await new Promise(resolve => setTimeout(resolve, 300));
        this.isNavigating = false;
    }

    // Получаем мета-информацию текущего маршрута
    get currentMeta(): RouteMeta {
        return ROUTE_META[this.currentPath];
    }

    // Получаем направление анимации
    get transitionDirection(): 'forward' | 'backward' {
        const routes = Object.values(AppRoutes);
        const currentIndex = routes.indexOf(this.currentPath);
        const previousIndex = routes.indexOf(this.previousPath);
        return currentIndex > previousIndex ? 'forward' : 'backward';
    }
}

export const routerStore = new RouterStore();