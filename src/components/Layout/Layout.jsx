import {
    AppShell, ScrollArea, Text,
} from '@mantine/core';

import {MainNavbar}                       from './MainNavbar';
import {MainHeader}                       from './MainHeader';
import {MainContent}                      from './MainContent';
import classes                            from './Layout.module.css';
import {uiStore}                          from "@/stores/ui";
import {observer}                         from "mobx-react-lite";
import {useNavigate, useLocation, Outlet} from 'react-router-dom';
import {useEffect}                        from 'react';

import {routerStore}    from '@/stores/router.js';
import {PageTransition} from './PageTransition';
import {GlobalErrorDisplay}              from "../Pages/ErrorNotifications/GlobalErrorDisplay";

const Layout = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();

    // Инициализируем навигацию при монтировании
    useEffect(() => {
        routerStore.setNavigate(navigate);
    }, [navigate]);

    // Синхронизируем текущий путь при изменении location
    useEffect(() => {
        if (location.pathname !== routerStore.currentPath) {
            routerStore.currentPath = location.pathname;
        }
    }, [location]);


    return (
        <AppShell
            header={{height: 60}}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: {mobile: !uiStore.isBurgerOpened, desktop: !uiStore.isBurgerOpened},
            }}
            padding="md"
        >
            <MainHeader />
            <MainNavbar />
            {/*<AppShell.Main>*/}
            {/*    <PageTransition>*/}
            {/*        <Outlet />*/}
            {/*    </PageTransition>*/}
            {/*</AppShell.Main>*/}
        </AppShell>
    );
});

export default Layout;