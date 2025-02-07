
import { uiStore } from './ui';
import { statsStore } from './stats';

export const rootStore = () => {

    const rootStore = {};

    rootStore.uiStore = uiStore(rootStore);
    rootStore.statsStore =statsStore(rootStore);

    return rootStore;
};