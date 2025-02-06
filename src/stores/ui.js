import {makeAutoObservable, action} from 'mobx';
import {createBrowserHistory} from 'history';
import {RouterStore, syncHistoryWithStore} from "@ibm/mobx-react-router";
import {rootStore} from "./root.js";

const routingStore = new RouterStore();
const browserHistory = createBrowserHistory();

export const uiStore = (rootStore) => {

    return makeAutoObservable({
            routing: routingStore,
            history: syncHistoryWithStore(browserHistory, routingStore),
            isBurgerOpened: false,

            toggleBurger: action(() => {
                this.isBurgerOpened = !this.isBurgerOpened;
            }),

            get getLocation() {
                return this.routing.location.pathname
            },
        }
    );
}

