// src/pages/Wallet.tsx
import { observer } from 'mobx-react-lite';
import { Container, Grid, Paper, Title, Tabs, LoadingOverlay } from '@mantine/core';
import { WalletInterface } from './WalletInterface';
import { walletStore } from '@/stores/wallet';
import { useEffect, useState } from 'react';

const Wallet = observer(() => {
    const [activeTab, setActiveTab] = useState('overview');

    // Автоматически обновляем балансы при открытии страницы
    useEffect(() => {
        if (walletStore.isConnected) {
            walletStore.fetchBalances();
        }
    }, [walletStore.isConnected]);

    if (!walletStore.isConnected) {
        return (
            <Container size="xl">
                <Title order={2} mb="xl">Кошелек</Title>
                <Paper p="xl" radius="md" shadow="sm">
                    <Title order={3} align="center">Подключите кошелек для продолжения</Title>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="xl">
            <Title order={2} mb="xl">Управление кошельком</Title>

            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List mb="md">
                    <Tabs.Tab value="overview">Обзор</Tabs.Tab>
                    <Tabs.Tab value="send">Отправка</Tabs.Tab>
                    <Tabs.Tab value="receive">Получение</Tabs.Tab>
                    <Tabs.Tab value="approve">Разрешения</Tabs.Tab>
                </Tabs.List>

                <Paper p="md" radius="md" shadow="sm" pos="relative">
                    <LoadingOverlay visible={walletStore.isLoadingBalances} />

                    <Tabs.Panel value="overview">
                        <Grid>
                            <Grid.Col span={12}>
                                <WalletInterface />
                            </Grid.Col>
                        </Grid>
                    </Tabs.Panel>

                    <Tabs.Panel value="send">
                        {/* Компонент для отправки средств */}
                        <Grid>
                            <Grid.Col span={12}>
                                <Title order={3} mb="md">Отправка средств</Title>
                                {/* Здесь будет компонент для отправки */}
                            </Grid.Col>
                        </Grid>
                    </Tabs.Panel>

                    <Tabs.Panel value="receive">
                        {/* Компонент для получения средств */}
                        <Grid>
                            <Grid.Col span={12}>
                                <Title order={3} mb="md">Получение средств</Title>
                                {/* Здесь будет компонент с адресом и QR-кодом */}
                            </Grid.Col>
                        </Grid>
                    </Tabs.Panel>

                    <Tabs.Panel value="approve">
                        {/* Компонент для управления разрешениями */}
                        <Grid>
                            <Grid.Col span={12}>
                                <Title order={3} mb="md">Управление разрешениями</Title>
                                {/* Здесь будет компонент для управления approve */}
                            </Grid.Col>
                        </Grid>
                    </Tabs.Panel>
                </Paper>
            </Tabs>
        </Container>
    );
});

export default Wallet;