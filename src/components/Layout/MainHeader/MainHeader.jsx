import { Group, ActionIcon, useMantineColorScheme,AppShell } from '@mantine/core';
import { FiSun, FiMoon } from 'react-icons/fi';
import classes from './MainHeader.module.css';


export const MainHeader = ({ opened, setOpened }) => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <AppShell.Header  className={classes.header} p="md">
            <Group position="apart">
                <Group>
                    {/*<MediaQuery largerThan="sm" styles={{ display: 'none' }}>*/}
                        <Burger
                            opened={opened}
                            onClick={() => setOpened((o) => !o)}
                            size="sm"
                            color={theme.colors.gray[6]}
                        />
                    {/*</MediaQuery>*/}
                    <Text size="xl" weight={700} color="brand">MyApp</Text>
                </Group>
                <ActionIcon
                    variant="outline"
                    color={dark ? 'yellow' : 'blue'}
                    onClick={() => toggleColorScheme()}
                    title="Toggle color scheme"
                >
                    {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
                </ActionIcon>
            </Group>
        </AppShell.Header>
    );
};