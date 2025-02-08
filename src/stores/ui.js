import {makeAutoObservable, action} from 'mobx';

export const uiStore = makeAutoObservable({
    isBurgerOpened: false,
    toggleBurger: () =>  uiStore.isBurgerOpened = !uiStore.isBurgerOpened

})

