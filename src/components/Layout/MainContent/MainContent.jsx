import {
    Highlight,
    AppShell,
    Paper,
    Title,
    Text,
    Space,
    Grid,
    Card,
    Badge,
    Button,
    Group,
    useMantineTheme, useMantineColorScheme, ThemeIcon, ScrollArea, Container,
} from '@mantine/core';

import {useEffect} from 'react'
import {FiTrendingUp, FiUsers, FiActivity, FiBox, FiLayers} from 'react-icons/fi';
import classes from './MainContent.module.css';
import {observer} from "mobx-react-lite";
import {statsStore} from '@/stores/stats.js';

const StatsGrid = observer(() => {

    useEffect(() => {
        statsStore.fetchStats();
    }, [statsStore]);

    const stats = [
        {
            title: "Пользователи",
            value: statsStore.stats.sales.value,
            diff: statsStore.stats.sales.diff,
            icon: FiUsers,
            color: "blue"
        },
        {
            title: "Активность",
            value: statsStore.stats.sales.value,
            diff: statsStore.stats.sales.diff,
            icon: FiActivity,
            color: "green"
        },
        {
            title: "Продажи",
            value: statsStore.stats.sales.value,
            diff: statsStore.stats.sales.diff,
            icon: FiTrendingUp,
            color: "red"
        },
        {
            title: "Продукты",
            value: statsStore.stats.products.value,
            diff: statsStore.stats.products.diff,
            icon: FiBox,
            color: "orange"
        }
    ];

    return (
        <Grid p="md">
            {stats.map((stat) => (
                <Grid.Col key={stat.title} xs={12} sm={6} md={3}>
                    <Card className={classes.card} withBorder radius="md" p="xs">
                        <Group position="apart">
                            <div>
                                <Text size="xs" color="dimmed">{stat.title}</Text>
                                <Text size="lg" weight={500}>{stat.value}</Text>
                            </div>
                            <stat.icon size={20} color={useMantineTheme().colors[stat.color][6]}/>
                        </Group>
                        <Group position="apart" mt="md">
                            <Badge
                                color={stat.color > 0 ? "green" : "red"}
                                variant="light"
                            >
                                {stat.color > 0 ? "+" : ""}{stat.color}%
                            </Badge>
                            <Text size="xs" color="dimmed">За месяц</Text>
                        </Group>
                    </Card>
                </Grid.Col>
            ))}
        </Grid>
    );
})

const WelcomeSection = observer(() => {
    const {colorScheme} = useMantineColorScheme();

    return (
        <Paper className={classes.paper} mb="xl" p="md">
            <Group position="apart" align="flex-start" spacing="xl">
                <div p={2}>
                    <Title className={classes.gradientText}
                           component={Title}
                           order={1}
                    >
                        Добро пожаловать!
                    </Title>
                    <Text
                        size="lg"
                        color="dimmed"
                        style={{
                            maxWidth: 600,
                            lineHeight: 1.6
                        }}
                    >
                        Это пример современного приложения с использованием Mantine UI,
                        поддержкой тёмной темы, адаптивным дизайном и стилизацией через Emotion.
                        Текущая тема: {colorScheme === 'dark' ? 'тёмная' : 'светлая'}.
                    </Text>
                    <Space h="xl"/>
                    <Group spacing="md">
                        <Button className={classes.animatedButton}
                                variant="gradient"
                                gradient={{from: 'blue.1', to: 'cyan.2'}}
                                size="lg"
                        >
                            Начать работу
                        </Button>
                        <Button className={classes.animatedButton}
                                variant="light"
                                color={colorScheme === 'dark' ? 'gray' : 'dark'}
                                size="lg"
                        >
                            Узнать больше
                        </Button>
                    </Group>
                </div>
                {/*<MediaQuery smallerThan="sm" styles={{ display: 'none' }}>*/}
                <ThemeIcon
                    size={120}
                    radius="md"
                    variant="gradient"
                    gradient={{from: 'blue', to: 'cyan'}}
                    style={{
                        transform: 'rotate(-10deg)',
                        transition: 'transform 0.3s ease'
                    }}
                >
                    <FiLayers size={80}/>
                </ThemeIcon>
                {/*</MediaQuery>*/}
            </Group>
        </Paper>
    );
});

export const MainContent = () => {
    const {theme} = useMantineTheme();
    return (
        <AppShell.Main>

            <WelcomeSection/>
            <Container size="xl" px="md" py="xl" h="100">
                <ScrollArea h="100">

                    <h1 c="red.6">{JSON.stringify(theme)}</h1>

                </ScrollArea>
            </Container>
            <Highlight
                ta="center"
                highlight={['highlighted', 'default']}
                highlightStyles={{
                    backgroundImage:
                        'linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))',
                    fontWeight: 700,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                You can change styles of highlighted part if you do not like default styles
            </Highlight>
            <Button variant="gradient"
                    gradient={{from: 'cyan', to: 'blue', deg: 90}}>Mantine button</Button>


            <StatsGrid/>
        </AppShell.Main>
    );
};