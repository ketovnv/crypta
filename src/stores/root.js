import { themeStore } from './theme';
import { uiStore } from './ui';
import { statsStore } from './stats';

export const rootStore = () => {

    const rootStore = {};

    rootStore.themeStore = themeStore(rootStore);
    rootStore.uiStore = uiStore(rootStore);
    rootStore.statsStore =statsStore(rootStore);

    return rootStore;
};