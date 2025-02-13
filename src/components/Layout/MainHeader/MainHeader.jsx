import {routerStore} from "@/stores/router.ts";
import {
    Text,
    Group,
    ActionIcon,
    useMantineColorScheme,
    AppShell,
    Burger,
    useComputedColorScheme,
    Button
}                    from '@mantine/core';
import {FiSun, FiMoon} from 'react-icons/fi';
import classes from './MainHeader.module.css';
import {uiStore} from "@/stores/ui.js";
import {observer} from "mobx-react-lite";



export const MainHeader = observer(() => {

    const {setColorScheme, toggleColorScheme, colorScheme} = useMantineColorScheme();
    let dark = colorScheme === 'dark';

    return (

        <AppShell.Header className={classes.header} px="md">
            <Group position="apart" justify="space-between" h="100%" align="center">
                <Group>
                    <img src="/assets/bitcoin.svg" alt="Bitcoin" className={classes.appIcon}/>
                    <Text className={classes.appName}>Reown AppKit</Text>
                </Group>
                <Group>
                    <Text size="xl" weight={500}>
                        {routerStore.currentMeta.title}
                    </Text>
                </Group>
                <ActionIcon
                    size="xl"
                    variant="outline"
                    color={dark ? 'yellow' : 'blue'}
                    onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
                    title="Toggle color scheme"
                >
                    {!dark ? <FiSun size={32}/> : <FiMoon size={32}/>}
                </ActionIcon>
            </Group>
        </AppShell.Header>
    )
        ;
});