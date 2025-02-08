import {
    Text,
    Group,
    ActionIcon,
    useMantineColorScheme,
    AppShell,
    Burger,
    useComputedColorScheme,
    Button
} from '@mantine/core';
import {FiSun, FiMoon} from 'react-icons/fi';
import classes from './MainHeader.module.css';
import {uiStore} from "@/stores/ui.js";
import {observer} from "mobx-react-lite";



export const MainHeader = observer(() => {

    const {setColorScheme,toggleColorScheme,colorScheme} = useMantineColorScheme();
    // const computedColorScheme = useComputedColorScheme('light', {getInitialValueInEffect: true});
     const dark = colorScheme === 'dark';
    return (

        <AppShell.Header className={classes.header} p="md">
            <Group position="apart" justify="space-between" h="100%" align="center">
                <Group>
                    {/*<MediaQuery largerThan="sm" styles={{ display: 'none' }}>*/}
                    <Burger
                        opened={uiStore.isBurgerOpened}
                        onClick={uiStore.toggleBurger}
                        size="lg"
                        color="gray.4"
                    />
                    {/*</MediaQuery>*/}
                    <Text size="xl" weight={700} color="brand">MyApp</Text>
                </Group>
                <Text size="xl" weight={700} color="brand">{colorScheme}</Text>
                <Group>
                    <Button onClick={() => setColorScheme('light')}>Light</Button>
                    <Button onClick={() => setColorScheme('dark')}>Dark</Button>
                    <Button onClick={() => setColorScheme('auto')}>Auto</Button>
                    <Button onClick={() => toggleColorScheme()}>Toggle</Button>
                </Group>
                <ActionIcon
                    size="lg"
                    variant="outline"
                    color={dark ? 'yellow' : 'blue'}
                    onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
                    title="Toggle color scheme"
                >
                    {dark ? <FiSun size={18}/> : <FiMoon size={18}/>}
                </ActionIcon>
            </Group>
        </AppShell.Header>
    )
        ;
});