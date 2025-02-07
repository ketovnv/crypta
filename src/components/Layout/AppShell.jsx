import {
    AppShell as MantineAppShell,
    Text,
    Burger,
    useMantineTheme,
} from '@mantine/core';
import { useState } from 'react';
import { MainNavbar } from './MainNavbar';
import { MainHeader } from './MainHeader';
import { MainContent } from './MainContent';

export const AppShell = () => {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    return (
        <MantineAppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark'
                        ? theme.colors.dark[8]
                        : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={<MainNavbar hidden={!opened} />}
            header={<MainHeader opened={opened} setOpened={setOpened} />}
        >
            <MainContent />
        </MantineAppShell>
    );
};