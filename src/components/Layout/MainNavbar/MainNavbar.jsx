import {AppShell, Text, Center, NavLink as MantineLink, ThemeIcon} from '@mantine/core'
import {NavLink as Link}                                           from 'react-router-dom'
import {
    FiHome,
    FiSettings,
    FiUser,
    FiBookmark,
    FiMessageSquare,
}                                                       from 'react-icons/fi'
import classes                                          from './MainNavbar.module.css'
import {Web3Inch}                                       from '../SvgIcons/Web3Inch.jsx'
import {observer}                                       from "mobx-react-lite";
//import {routerStore} from '@/stores/router.ts';
import {ROUTES, ROUTE_META}                             from '../../Pages/routes.tsx';


export const MainNavbar = observer(() => {

    return (
        <AppShell.Navbar
            className={classes.navbar}
            p="md"
            // hidden={!uiStore.isBurgerOpened}
            width={{sm: 200, lg: 300}}
        >
            <Center width={{sm: 200, lg: 300}}>
                    <Web3Inch color1="yellow"  color2="red" />
            </Center>


            {Object.entries(ROUTES).map(([key, path]) => {
                const meta = ROUTE_META[path]

                return (
                    <MantineLink
                        className={classes.link}
                        leftSection={meta.icon}
                        component={Link} // импортируйте Link из react-router-dom
                        to={path}
                        key={meta.title}
                        label={meta.title}
                    />)

            })}

        </AppShell.Navbar>
    );
});