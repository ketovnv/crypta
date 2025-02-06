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
    useMantineTheme
} from '@mantine/core';
import {FiTrendingUp, FiUsers, FiActivity, FiBox} from 'react-icons/fi';
import styled from '@emotion/styled';

// Улучшенные стилизованные компоненты
const StyledContainer = styled(Container)`
    padding: ${({theme}) => theme.spacing.xl};

    @media (max-width: ${({theme}) => theme.breakpoints.sm}) {
        padding: ${({theme}) => theme.spacing.md};
    }
`;

const GradientText = styled(Text)`
    background: ${({theme}) =>
            theme.colorScheme === 'dark'
                    ? 'linear-gradient(45deg, #4DABF7 0%, #228BE6 100%)'
                    : 'linear-gradient(45deg, #339AF0 0%, #1C7ED6 100%)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
`;

const AnimatedButton = styled(Button)`
    transition: all 0.2s ease;
    overflow: hidden;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
                45deg,
                rgba(255, 255, 255, 0.1),
                rgba(255, 255, 255, 0)
        );
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }

    &:hover::before {
        transform: translateX(100%);
    }

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({theme}) =>
                theme.colorScheme === 'dark'
                        ? theme.darkShadows.md
                        : theme.shadows.md};
    }

    &:active {
        transform: translateY(1px);
    }
`;

const StyledPaper = styled(Paper)`
    padding: ${({theme}) => theme.spacing.lg};
    border-radius: ${({theme}) => theme.radius.md};
    box-shadow: ${({theme}) => theme.shadows.md};
    background: ${({theme}) =>
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white};
`;

const StyledCard = styled(Card)`
    transition: all 0.2s ease;
    background: ${({theme}) =>
            theme.colorScheme === 'dark'
                    ? theme.colors.dark[6]
                    : theme.white};
    border: 1px solid ${({theme}) =>
            theme.colorScheme === 'dark'
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]};

    &:hover {
        transform: translateY(-4px);
        box-shadow: ${({theme}) =>
                theme.colorScheme === 'dark'
                        ? theme.darkShadows.lg
                        : theme.shadows.lg};
        border-color: ${({theme}) =>
                theme.colorScheme === 'dark'
                        ? theme.colors.dark[3]
                        : theme.colors.gray[3]};
    }

    .card-icon {
        transition: transform 0.2s ease;
    }

    &:hover .card-icon {
        transform: scale(1.1);
    }
`;

const StatsGrid = observer(() => {
    const {statsStore} = useStore();
    const theme = useMantineTheme();

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
                    <StyledCard p="xs">
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
                    </StyledCard>
                </Grid.Col>
            ))}
        </Grid>
    );
})

const WelcomeSection = observer(() => {
    const {themeStore} = useStore();

    return (
        <StyledPaper mb="xl">
            <Group position="apart" align="flex-start" spacing="xl">
                <div>
                    <GradientText
                        component={Title}
                        order={1}
                        style={{
                            fontSize: '2.5rem',
                            marginBottom: '1rem'
                        }}
                    >
                        Добро пожаловать!
                    </GradientText>
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
                        Текущая тема: {themeStore.isDark ? 'тёмная' : 'светлая'}.
                    </Text>
                    <Space h="xl"/>
                    <Group spacing="md">
                        <AnimatedButton
                            variant="gradient"
                            gradient={{from: 'blue', to: 'cyan'}}
                            size="lg"
                        >
                            Начать работу
                        </AnimatedButton>
                        <AnimatedButton
                            variant="light"
                            color={themeStore.isDark ? 'gray' : 'dark'}
                            size="lg"
                        >
                            Узнать больше
                        </AnimatedButton>
                    </Group>
                </div>
                <MediaQuery smallerThan="sm" styles={{display: 'none'}}>
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
                </MediaQuery>
            </Group>
        </StyledPaper>
    );
});

export const MainContent = () => {
    return (
        <StyledContainer size="xl">
            <WelcomeSection/>
            <StatsGrid/>
        </StyledContainer>
    );
};