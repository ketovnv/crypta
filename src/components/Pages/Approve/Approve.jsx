import { observer } from 'mobx-react-lite';
import { Container, Grid, Paper, Title, Text, Button, Group, Badge } from '@mantine/core';

import { useEffect } from 'react';
import {logger} from "@/stores/logger.js";
logger.warning("🕸️", " Компонент Сеть");

const Approve = observer(() => {
    // При монтировании получаем информацию о текущей сети
    // useEffect(() => {
    //     if (walletStore.isConnected) {
    //         walletStore.fetchNetworkInfo();
    //     }
    // }, [walletStore.isConnected]);

    return (
        <Container size="xl">




            {/*<Title order={2} mb="xl">Управление сетями</Title>*/}

            <Grid>

                {/* Текущая сеть */}
                <Grid.Col span={12}>
                    <Paper p="md" radius="md" shadow="sm" mb="xl">

                        <Group position="apart">
                            <div>
                                <Text size="sm" color="dimmed">🕸️Текущая сеть🕸️</Text>
                                <Title order={3}>{walletStore.activeChain}</Title>
                            </div>
                            <Badge size="lg" variant="filled">
                                {walletStore.isConnected ? 'Подключено' : 'Не подключено'}
                            </Badge>
                        </Group>
                    </Paper>
                </Grid.Col>

                {/* Список доступных сетей */}
                <Grid.Col span={12}>
                    <Paper p="md" radius="md" shadow="sm">
                        <Title order={3} mb="xl">Доступные сети</Title>

                        <Grid>
                            {networks.map((network, index) => (
                                <Grid.Col key={network.id} span={4}>
                                    <Paper
                                        p="md"
                                        radius="md"
                                        shadow="sm"
                                        style={{
                                            border: network.id === walletStore.selectedNetworkId
                                                ? '2px solid blue'
                                                : '1px solid transparent'
                                        }}
                                    >
                                        <Group position="apart" mb="md">
                                            <Text weight={500}>{network.name}</Text>
                                            {network.id === walletStore.selectedNetworkId && (
                                                <Badge color="blue">Активна</Badge>
                                            )}
                                        </Group>

                                        <Text size="sm" color="dimmed" mb="md">
                                            Chain ID: {network.id}
                                        </Text>

                                        <Button
                                            fullWidth
                                            variant={network.id === walletStore.selectedNetworkId ? 'light' : 'filled'}
                                            onClick={() => walletStore.switchNetwork(index)}
                                            disabled={!walletStore.isConnected || network.id === walletStore.selectedNetworkId}
                                        >
                                            {network.id === walletStore.selectedNetworkId
                                                ? 'Текущая сеть'
                                                : 'Переключить'
                                            }
                                        </Button>
                                    </Paper>
                                </Grid.Col>
                            ))}
                        </Grid>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
});

export default Network;
