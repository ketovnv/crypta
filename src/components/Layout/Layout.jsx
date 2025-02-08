import {
    AppShell,
} from '@mantine/core';

import { MainNavbar } from './MainNavbar';
import { MainHeader } from './MainHeader';
import { MainContent } from './MainContent';
import classes from './Layout.module.css';
import {uiStore} from "@/stores/ui.js";
import {observer} from "mobx-react-lite";

export const Layout = observer(() => {
    return (
        <AppShell
            styles={classes.layout}
            padding="md"
            header={{ height: 80 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !uiStore.isBurgerOpened,desktop:!uiStore.isBurgerOpened}
            }}
            main={{padding: 20}}

        >
            <MainHeader/>
            <MainNavbar/>
            <MainContent/>
        </AppShell>
    );
});