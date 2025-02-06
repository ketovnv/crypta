import App from './App.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import {MantineProvider} from '@mantine/core';
import {observer} from 'mobx-react';
import {Router, Route, Routes} from 'react-router';
import {uiStore as ui} from '@stores/root.js';
import '@mantine/core/styles/global.css';
import FPSStats from "react-fps-stats/src";
import {HomePage} from "@/Pages/Home.page.jsx";
import '@mantine/core/styles.css';


@observer
class AppContainer extends React.Component {
    render() {
        const {isBurgerOpened,toggleBurger,history,routing} = ui
        return (
            <MantineProvider defaultColorScheme="dark" forceColorScheme="dark" >
                <App/>
            </MantineProvider>)

    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <AppContainer/>
);

