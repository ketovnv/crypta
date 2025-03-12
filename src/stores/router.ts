// routerStore.ts (или transitionStore.ts)
import { makeAutoObservable, action } from 'mobx';
// @ts-ignore
import { ROUTES_LAZY } from '@components/pages/routes';
import { Suspense } from 'react';
import React from 'react';

class RouterStore {
  currentPath: string = '/';
  previousComponent: React.ReactNode | null = null;
  isTransitioning: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action // Декоратор action, чтобы пометить, что этот метод изменяет состояние
  goTo(path: string, options?: { delay?: number }) {
    const { delay = 500 } = options || {}; // default delay

    if (this.currentPath === path) return;

    this.isTransitioning = true;
    //Сохраняем текущий компонент как предыдущий
    const CurrentComponent = ROUTES_LAZY[this.currentPath]?.element;
    this.previousComponent = CurrentComponent ? CurrentComponent : null;


    setTimeout(
        action(() => { // Используем action внутри setTimeout, чтобы MobX корректно отслеживал изменения
          this.currentPath = path;
          this.isTransitioning = false;
          this.previousComponent = null; // Очищаем previousComponent
        }),
        delay // Задержка перед переходом (в миллисекундах)
    );
  }

  async preloadPage(path: string) {
    if (ROUTES_LAZY[path]) {
      await ROUTES_LAZY[path].element(); // Вызываем lazy-функцию, не сохраняя результат
    }
  }
}

export const routerStore = new RouterStore();
