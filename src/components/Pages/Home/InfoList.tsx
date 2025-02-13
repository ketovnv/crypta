// src/components/InfoList.tsx
import { observer } from 'mobx-react-lite';
import { Card, Text, Stack, Group, Badge, Transition } from '@mantine/core';
import { walletStore } from '../../../stores/wallet.ts';
import { useEffect } from 'react';

export const InfoList = observer(() => {
    // Подписываемся на события при монтировании компонента
    useEffect(() => {
        const unsubscribe = walletStore.initialize();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return (
        <Card shadow="sm" p="lg">
            <Stack spacing="md">
                {/* Секция информации о кошельке */}
                <Stack spacing="xs">
                    <Text weight={500} size="lg">Информация о кошельке</Text>

                    <Group spacing="xs">
                        <Text size="sm">Статус:</Text>
                        <Badge
                            color={walletStore.isConnected ? 'green' : 'red'}
                            variant="light"
                        >
                            {walletStore.isConnected ? 'Подключен' : 'Отключен'}
                        </Badge>
                    </Group>

                    {walletStore.isConnected && (
                        <>
                            <Text size="sm">Адрес: {walletStore.address}</Text>
                            <Text size="sm">CAIP адрес: {walletStore.caipAddress}</Text>
                        </>
                    )}
                </Stack>

                {/* Секция информации о сети */}
                <Stack spacing="xs">
                    <Text weight={500} size="lg">Сеть</Text>
                    <Text size="sm">Активная сеть: {walletStore.activeChain}</Text>
                    <Text size="sm">ID сети: {walletStore.selectedNetworkId}</Text>
                </Stack>

                {/* Секция информации о кошельке */}
                {walletStore.walletInfo && (
                    <Stack spacing="xs">
                        <Text weight={500} size="lg">Информация о кошельке</Text>
                        <Text size="sm">
                            Название: {walletStore.walletInfo.name}
                        </Text>
                    </Stack>
                )}

                {/* Секция последних событий */}
                <Stack spacing="xs">
                    <Text weight={500} size="lg">Последние события</Text>
                    {walletStore.events.map((event, index) => (
                        <Transition
                            key={index}
                            mounted={true}
                            transition="slide-right"
                            duration={400}
                        >
                            {(styles) => (
                                <Text size="sm" style={styles}>
                                    {JSON.stringify(event)}
                                </Text>
                            )}
                        </Transition>
                    ))}
                </Stack>

                {/* Дополнительная информация */}
                <Group position="apart">
                    <Text size="sm">Тема: {walletStore.themeMode}</Text>
                    <Badge
                        color={walletStore.loading ? 'yellow' : 'green'}
                        variant="dot"
                    >
                        {walletStore.loading ? 'Загрузка' : 'Готово'}
                    </Badge>
                </Group>
            </Stack>
        </Card>
    );
});