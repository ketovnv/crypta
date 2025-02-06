import { Navbar, NavLink, ScrollArea } from '@mantine/core';
import {
    FiHome,
    FiSettings,
    FiUser,
    FiBookmark,
    FiMessageSquare
} from 'react-icons/fi';
import styled from '@emotion/styled';

const StyledNavbar = styled(Navbar)`
    background: ${({ theme }) =>
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white};
    border-right: 2px solid ${({ theme }) =>
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]};
`;

const menuItems = [
    { icon: FiHome, label: 'Главная', link: '/' },
    { icon: FiUser, label: 'Профиль', link: '/profile' },
    { icon: FiMessageSquare, label: 'Сообщения', link: '/messages' },
    { icon: FiBookmark, label: 'Закладки', link: '/bookmarks' },
    { icon: FiSettings, label: 'Настройки', link: '/settings' },
];

export const MainNavbar = ({ hidden }) => {
    return (
        <StyledNavbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={hidden}
            width={{ sm: 200, lg: 300 }}
        >
            <Navbar.Section grow component={ScrollArea}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.link}
                        icon={<item.icon size={20} />}
                        label={item.label}
                        component="a"
                        href={item.link}
                    />
                ))}
            </Navbar.Section>
        </StyledNavbar>
    );
};