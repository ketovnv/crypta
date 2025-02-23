// import AnimatedNumber      from "@components/Animations/AnimatedNumber.jsx";
import {
    Text,
    Group,
    ActionIcon,
    useMantineColorScheme,
    AppShell,
    Burger,
    Image,
    Button,
}                          from '@mantine/core';
import {observer}          from "mobx-react-lite";
import {useEffect}         from "react";
import {FiSun, FiMoon}     from 'react-icons/fi';
import {useLocation}       from "react-router-dom";
import classes             from './MainHeader.module.css';
import {routerStore}       from "@/stores/router.ts";
import {useNavigate}       from "react-router";
//import {observer} from "mobx-react-lite";
//
//
//
export const MainHeader = observer(
    () => {


        const {setColorScheme, toggleColorScheme, colorScheme} = useMantineColorScheme();
        let dark = colorScheme === 'dark';

        return (

            <AppShell.Header className={classes.header} px="md" align="center">
                <Group position="apart" justify="space-between" h="100%" align="center">
                    <Group>
                        <Image src="/assets/bitcoin.svg" alt="Bitcoin" className={classes.appIcon} />
                        <Text className={classes.appName}>React AppKit Reown</Text>
                    </Group>
                    <ActionIcon
                        size="lg"
                        variant="outline"
                        color={dark ? 'yellow' : 'blue'}
                        onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
                        title="Toggle color scheme"
                    >
                        {!dark ? <FiSun size={32} /> : <FiMoon size={32} />}
                    </ActionIcon>
                </Group>
            </AppShell.Header>
        )
    },
);