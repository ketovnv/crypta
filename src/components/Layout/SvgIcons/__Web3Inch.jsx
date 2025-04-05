import React, {useState} from 'react';
import {animated, useSpring} from '@react-spring/web';
import {Box, Button, Paper, Stack, Text, Title} from '@mantine/core';

const AnimatedSVGFilter = () => {
    const [active, setActive] = useState(false);

    // Создаем анимированное значение для opacity
    const {opacity, width} = useSpring({
        opacity: active ? 0.8 : 0.1,
        width: active ? 100 : 200,
        config: {tension: 170, friction: 26}
    });

    return (
        <Box p="xl" bg="gray.1" sx={{minHeight: '100vh'}} style={{transform: 'scale: .5'}}>
            <Stack align="center" spacing="md">
                <Title order={2}>Анимированный SVG-фильтр</Title>
                <Title order={2}>{JSON.stringify(opacity)}</Title>

                <Box>
                    <svg width="300" height="300">
                        <defs>
                            <filter id="shadow" x="0" y="0" width="200%" height="200%">
                                {/* Первая тень */}
                                <feDropShadow
                                    dx="0.3"
                                    dy="0.3"
                                    stdDeviation="0.5"
                                    floodColor="#FF0000"
                                    floodOpacity={opacity}
                                />
                                {/* Вторая тень */}
                                <feDropShadow
                                    dx="0.5"
                                    dy="0.7"
                                    stdDeviation="0.7"
                                    floodColor="#FFFF00"
                                    floodOpacity={opacity}
                                />
                                {/* Третья тень */}
                                <feDropShadow
                                    dx="0.5"
                                    dy="0.5"
                                    stdDeviation="0.3"
                                    floodColor="#000000"
                                    floodOpacity={opacity}
                                />
                            </filter>
                        </defs>

                        <animated.rect
                            x="50"
                            y="50"
                            width={width}
                            height="200"
                            fill="#228be6"
                            filter="url(#shadow)"
                            rx="10"
                            opacity={opacity}
                            style={{cursor: 'pointer'}}
                            onClick={() => setActive(!active)}
                        />
                    </svg>
                </Box>

                <Button
                    onClick={() => setActive(!active)}
                    variant="filled"
                    color="blue"
                >
                    Переключить тени ({active ? 'Яркие' : 'Слабые'})
                </Button>

                <Paper p="md" shadow="sm" mt="md" sx={{maxWidth: '500px'}}>
                    <Title order={4} mb="xs">Как это работает:</Title>
                    <Text mb="xs">
                        SVG-фильтр содержит три эффекта тени с разными параметрами.
                        React-spring анимирует значение opacity, которое применяется к каждой тени.
                    </Text>
                    <Text>
                        Вы можете кликнуть на прямоугольник или кнопку, чтобы увидеть анимацию.
                    </Text>
                </Paper>
            </Stack>
        </Box>
    );
};

export default AnimatedSVGFilter;
