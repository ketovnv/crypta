const WelcomeSection = () => (
    <MainNavbar mb="xl">
        <Group position="apart" align="flex-start">
            <div>
                <Title order={1}>Добро пожаловать!</Title>
                <Space h="md" />
                <Text size="lg" color="dimmed" style={{ maxWidth: 600 }}>
                    Это пример современного приложения с использованием Mantine UI,
                    поддержкой тёмной темы, адаптивным дизайном и стилизацией через Emotion.
                </Text>
            </div>
            <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
                Начать работу
            </Button>
        </Group>
    </MainNavbar>
);