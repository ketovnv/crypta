import {
    AppShell,
    useMantineTheme,
} from '@mantine/core';
import { useState } from 'react';
import { MainNavbar } from './MainNavbar';
import { MainHeader } from './MainHeader';
import { MainContent } from './MainContent';
import classes from './Layout.module.css';

export const Layout = () => {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    return (
        <AppShell
            styles={classes.layout}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={<MainNavbar hidden={!opened} />}
            header={<MainHeader opened={opened} setOpened={setOpened} />}
        >
            <MainContent />
        </AppShell>
    );
};