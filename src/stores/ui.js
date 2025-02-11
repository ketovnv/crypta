import {makeAutoObservable, action} from 'mobx';

export const uiStore = makeAutoObservable({
    isBurgerOpened: true,
    toggleBurger: () =>  uiStore.isBurgerOpened = !uiStore.isBurgerOpened

})

