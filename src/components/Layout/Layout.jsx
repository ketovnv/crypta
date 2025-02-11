import {
    AppShell, ScrollArea, Text,
} from '@mantine/core';

import {MainNavbar} from './MainNavbar';
import {MainHeader} from './MainHeader';
import {MainContent} from './MainContent';
import classes from './Layout.module.css';
import {uiStore} from "@/stores/ui";
import {observer} from "mobx-react-lite";

export const Layout = observer(() => {
    return (
            <AppShell
                header={{ height: 60 }}
                navbar={{
                    width: 300,
                    breakpoint: 'sm',
                    collapsed: { mobile: !uiStore.isBurgerOpened,desktop: !uiStore.isBurgerOpened},
                }}
                padding="md"
            >
                <MainHeader/>
                <MainNavbar/>
                <MainContent/>
            </AppShell>
     );
});