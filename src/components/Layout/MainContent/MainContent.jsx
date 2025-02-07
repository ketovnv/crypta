import {
    Container,
    Paper,
    Title,
    Text,
    Space,
    Grid,
    Card,
    Badge,
    Button,
    Group,
    useMantineTheme, useMantineColorScheme, ThemeIcon
} from '@mantine/core';
import {useEffect} from 'react'
import {FiTrendingUp, FiUsers, FiActivity, FiBox} from 'react-icons/fi';
import classes from './MainContent.module.css';
import {observer} from "mobx-react-lite";
import {useStores} from '@/stores/store.context.jsx';

const StatsGrid = observer(() => {
    const {statsStore} = useStores();

    useEffect(() => {
        statsStore.fetchStats();
    }, [statsStore]);

    const stats = [
        {
            title: "Пользователи",
            value: statsStore.stats.users.value,
            diff: statsStore.stats.users.diff,
            icon: FiUsers,
            color: "blue"
        },
        {
            title: "Активность",
            value: statsStore.stats.activity.value,
            diff: statsStore.stats.activity.diff,
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
        <Grid>
            {stats.map((stat) => (
                <Grid.Col key={stat.title} xs={12} sm={6} md={3}>
                    <Card classes={classes.card} withBorder radius="md" p="xs">
                        <Group position="apart">
                            <div>
                                <Text size="xs" color="dimmed">{stat.title}</Text>
                                <Text size="lg" weight={500}>{stat.value}</Text>
                            </div>
                            <stat.icon size={20} color={useMantineTheme().colors[stat.color][6]}/>
                        </Group>
                        <Group position="apart" mt="md">
                            <Badge
                                color={stat.diff > 0 ? "green" : "red"}
                                variant="light"
                            >
                                {stat.diff > 0 ? "+" : ""}{stat.diff}%
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
        <Paper stylle={classes.paper} mb="xl">
            <Group position="apart" align="flex-start" spacing="xl">
                <div>
                    <h2 style={classes.gradientText}
                        component={Title}
                        order={1}
                    >
                        Добро пожаловать!
                    </h2>
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
                        <Button style={classes.animatedButton}
                                variant="gradient"
                                gradient={{from: 'blue', to: 'cyan'}}
                                size="lg"
                        >
                            Начать работу
                        </Button>
                        <Button style={classes.animatedButton}
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
    return (
        <Container stylle={classes.container} size="xl">
            <WelcomeSection/>
            <StatsGrid/>
        </Container>
    );
};