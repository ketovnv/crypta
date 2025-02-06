import {makeAutoObservable, action} from 'mobx';
import {createBrowserHistory} from 'history';
import {RouterStore, syncHistoryWithStore} from "@ibm/mobx-react-router";
import {rootStore} from "./root.js";



export const themeStore =(rootStore) => {

    return makeAutoObservable({
            colorScheme: 'dark',
            toggleColorScheme: action((value) => {
                this.colorScheme = value || (this.colorScheme === 'dark' ? 'light' : 'dark');
            }),

            get isDark() {
                return this.colorScheme === 'dark';
            }
        }
    );

}

