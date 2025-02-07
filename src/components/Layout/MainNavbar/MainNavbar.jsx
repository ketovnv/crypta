import {NavLink, ScrollArea, AppShell} from '@mantine/core';
import {
    FiHome,
    FiSettings,
    FiUser,
    FiBookmark,
    FiMessageSquare
} from 'react-icons/fi';
import classes from './MainNavbar.module.css';


const menuItems = [
    {icon: FiHome, label: 'Главная', link: '/'},
    {icon: FiUser, label: 'Профиль', link: '/profile'},
    {icon: FiMessageSquare, label: 'Сообщения', link: '/messages'},
    {icon: FiBookmark, label: 'Закладки', link: '/bookmarks'},
    {icon: FiSettings, label: 'Настройки', link: '/settings'},
];

export const MainNavbar = ({hidden}) => {
    return (
        <AppShell.Navbar
            className={classes.navbar}
            p="md"
            hiddenBreakpoint="sm"
            hidden={hidden}
            width={{sm: 200, lg: 300}}
        >
            <ScrollArea>
            {menuItems.map((item) => (
                <NavLink
                    key={item.link}
                    icon={<item.icon size={20}/>}
                    label={item.label}
                    component="a"
                    href={item.link}
                />))}
            </ScrollArea>
        </AppShell.Navbar>
    );
};