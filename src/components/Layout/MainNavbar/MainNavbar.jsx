import {NavLink, ScrollArea, AppShell, Text, Center} from '@mantine/core'
import {
    FiHome,
    FiSettings,
    FiUser,
    FiBookmark,
    FiMessageSquare,
}                                                    from 'react-icons/fi'
import classes                                       from './MainNavbar.module.css'
import {Web3Inch}                                    from '../SvgIcons/Web3Inch.jsx'
import {observer}                        from "mobx-react-lite";
import {routerStore} from '@/stores/router.ts';
import {ROUTES, ROUTE_META} from '../../Pages/routes.tsx';


export const MainNavbar = observer(() => {

    return (
        <AppShell.Navbar
            className={classes.navbar}
            p="md"
            // hidden={!uiStore.isBurgerOpened}
            width={{sm: 200, lg: 300}}
        >
            <Center width={{sm: 200, lg: 300}}>
                <Web3Inch />
            </Center>
            <ScrollArea>
                {Object.entries(ROUTES).map(([key, path]) => {
                    const meta = ROUTE_META[path];
                    const isActive = path === routerStore.currentPath;

                    return (
                        <NavLink
                            variant={isActive ? 'filled' : 'light'}
                            key={meta.title}
                            leftSection={<meta.icon size={25} />}
                            label={<Text className={classes.link}>{meta.titlel}</Text>}
                            component="a"
                            href={path}
                        />)
                })}
            </ScrollArea>
        </AppShell.Navbar>
    );
});