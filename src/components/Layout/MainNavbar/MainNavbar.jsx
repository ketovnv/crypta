import {NavLink, ScrollArea, AppShell, Text, Center} from '@mantine/core'
import {
    FiHome,
    FiSettings,
    FiUser,
    FiBookmark,
    FiMessageSquare
} from 'react-icons/fi'
import classes from './MainNavbar.module.css'
import {Web3Inch} from '../SvgIcons/Web3Inch.jsx'
import {observer} from "mobx-react-lite";


const menuItems = [
    {icon: FiHome, label: 'Главная', link: '/'},
    {icon: FiUser, label: 'Профиль', link: '/profile'},
    {icon: FiMessageSquare, label: 'Сообщения', link: '/messages'},
    {icon: FiBookmark, label: 'Закладки', link: '/bookmarks'},
    {icon: FiSettings, label: 'Настройки', link: '/settings'},
];
export const MainNavbar = observer (() => {

    return (
        <AppShell.Navbar
            className={classes.navbar}
            p="md"
            // hidden={!uiStore.isBurgerOpened}
            width={{sm: 200, lg: 300}}
        >
            <Center width={{sm: 200, lg: 300}}>
                <Web3Inch/>
            </Center>
            <ScrollArea>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        leftSection={<item.icon size={25}/>}
                        label={<Text className={classes.link}>{item.label}</Text>}
                        component="a"
                        href={item.link}
                    />))}
            </ScrollArea>
        </AppShell.Navbar>
    );
});