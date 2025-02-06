import { themeStore } from './theme';
import { createUiStore } from './ui.store';
import { createStatsStore } from './stats.store';

export const rootStore = () => {

    const rootStore = {};

    // Инициализируем сторы, передавая rootStore для кросс-стор взаимодействия
    rootStore.themeStore = themeStore(rootStore);
    rootStore.uiStore = createUiStore(rootStore);
    rootStore.statsStore = createStatsStore(rootStore);

    return rootStore;
};