const StatsGrid = () => {
    const stats = [
        {
            title: "Пользователи",
            value: "13,456",
            diff: 12,
            icon: FiUsers,
            color: "blue"
        },
        {
            title: "Активность",
            value: "891",
            diff: -3,
            icon: FiActivity,
            color: "green"
        },
        {
            title: "Продажи",
            value: "$34,234",
            diff: 18,
            icon: FiTrendingUp,
            color: "red"
        },
        {
            title: "Продукты",
            value: "145",
            diff: 7,
            icon: FiBox,
            color: "orange"
        }
    ];

    return (
        <Grid>
            {stats.map((stat) => (
                <Grid.Col key={stat.title} xs={12} sm={6} md={3}>
                    <MainHeader p="xs">
                        <Group position="apart">
                            <div>
                                <Text size="xs" color="dimmed">{stat.title}</Text>
                                <Text size="lg" weight={500}>{stat.value}</Text>
                            </div>
                            <stat.icon size={20} color={useMantineTheme().colors[stat.color][6]} />
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
                    </MainHeader>
                </Grid.Col>
            ))}
        </Grid>
    );
};