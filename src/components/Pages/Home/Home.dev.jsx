// src/pages/HomeDev.tsx
import '@reown/appkit-wallet-button/react';
import { observer } from 'mobx-react-lite';
import {
    Text,
    Group,
    Container,
    List,
    ThemeIcon,
    Code,
    Title,
    Button,
    Stack,
    Center,
    Loader
} from '@mantine/core';
import { IoCaretForwardCircle } from '@react-icons/io5';
import { useEffect } from 'react';
import { walletStore } from '@/stores/wallet';
import classes from "./Home.module.css";

import {
    useAppKitState,
    useAppKitEvents,
    useAppKitAccount,
    useWalletInfo,
    useDisconnect
} from '@reown/appkit/react';

const HomeDev = observer(() => {


    const { address, caipAddress, isConnected, status } = useAppKitAccount();
    const event = useAppKitEvents();
    const { walletInfo } = useWalletInfo();
    const { disconnect } = useDisconnect();




    useEffect(() => {
        walletStore.updateConnectionState({ isConnected, status });
    }, [isConnected, status]);

    useEffect(() => {
        if (isConnected) {
            walletStore.updateAddresses({ address, caipAddress });
        }
    }, [isConnected, address, caipAddress]);

    useEffect(() => {
        walletStore.handleEvent(event);
    }, [event]);

    const handleDisconnect = async () => {
        try {
            await disconnect();
            walletStore.reset();
        } catch (error) {
            walletStore.setError(error.message);
        }
    };


    // useEffect(() => {
    //     const handleVendorEvent = (event) => {
    //         console.log('Event caught:', event); // Отладочный лог
    //         alert(JSON.stringify(event));
    //     };
    //
    //     // Попробуем отловить все события с "w3m" в имени
    //     window.addEventListener('w3m_event', handleVendorEvent);
    //     window.addEventListener('w3m-event', handleVendorEvent);
    //     window.addEventListener('w3mevent', handleVendorEvent);
    //
    //     // И для уверенности добавим общий слушатель
    //     const handleAllEvents = (event) => {
    //         if (event.type.includes('w3m')) {
    //             console.log('Caught w3m event:', event);
    //         }
    //     };
    //     window.addEventListener('*', handleAllEvents);
    //
    //     return () => {
    //         window.removeEventListener('w3m_event', handleVendorEvent);
    //         window.removeEventListener('w3m-event', handleVendorEvent);
    //         window.removeEventListener('w3mevent', handleVendorEvent);
    //         window.removeEventListener('*', handleAllEvents);
    //     };
    // }, []);







    //
    //
    // // Слушаем события вендора
    // useEffect(() => {
    //     const handleVendorEvent = (event) => {
    //         alert(JSON.stringify(event))
    //         // Проверяем, что это событие логирования вендора
    //         // if (event?.detail?.time && event?.detail?.context === 'in') {
    //         //     walletStore.handleVendorEvent(event.detail);
    //         // }
    //     };
    //
    //     // Подписываемся на события
    //     window.addEventListener('w3m_event', handleVendorEvent);
    //
    //     return () => {
    //         window.removeEventListener('w3m_event', handleVendorEvent);
    //     };
    // }, []);
    //





    return (
        <Container size="xl" w="75vw">
            <List
                spacing="xs"
                size="sm"
                className={classes.card}
                center
                icon={
                    <ThemeIcon
                        color={walletStore.isConnected ? 'teal' : 'gray'}
                        className={classes.arrowIcon}
                        size={15}
                        radius="md"
                        variant="outline"
                    >
                        {walletStore.isConnected && <IoCaretForwardCircle />}
                    </ThemeIcon>
                }
            >
                <List.Item>
                    <Group>
                        <Code>Выбранная сеть</Code>
                        <appkit-network-button />
                    </Group>
                </List.Item>

                {walletStore.isConnected && (
                    <Group justify="space-between" align="center">
                        <Stack>
                            <List.Item>
                                <Code>Адрес:</Code>
                                <Text className={classes.listText} component="span">
                                    {walletStore.address}
                                </Text>
                            </List.Item>

                            <List.Item style={{ position: "relative", top: "-15px" }}>
                                <Code>Адрес caip:</Code>
                                <Text className={classes.listText} component="span">
                                    {walletStore.caipAddress}
                                </Text>
                            </List.Item>

                            {/* Балансы */}
                            {/*{walletStore.isReady && (*/}
                            {/*    <>*/}
                            {/*        <List.Item>*/}
                            {/*            <Code>Баланс:</Code>*/}
                            {/*            {walletStore.isLoadingBalances ? (*/}
                            {/*                <Loader size="sm" />*/}
                            {/*            ) : (*/}
                            {/*                <Text className={classes.listText} component="span">*/}
                            {/*                    {walletStore.formattedBalances.native.value} {walletStore.formattedBalances.native.symbol}*/}
                            {/*                    {' / '}*/}
                            {/*                    {walletStore.formattedBalances.usdt.value} {walletStore.formattedBalances.usdt.symbol}*/}
                            {/*                </Text>*/}
                            {/*            )}*/}
                            {/*        </List.Item>*/}
                            {/*    </>*/}
                            {/*)}*/}
                        </Stack>

                        <Button
                            onClick={handleDisconnect}
                            variant="outline"
                            color="red"
                            loading={walletStore.loading}
                        >
                            Отключить
                        </Button>
                    </Group>
                )}
            </List>

            {walletStore.isConnected ? (
                <Group align="center">
                    <appkit-account-button />
                    <Title>/&nbsp;
                        <Text className={classes.walletName} component="span" inherit>
                            {walletStore.walletInfo?.name}
                        </Text>
                    </Title>
                    <Code color="teal" className={classes.status}>
                        {walletStore.status === 'connected' ? 'Подключён' : walletStore.status}
                    </Code>
                </Group>
            ) : (
                <Center>
                    <appkit-connect-button />
                </Center>
            )}

            <appkit-wallet-button />

            {walletStore.error && (
                <Text color="red" mt="md">
                    {walletStore.error}
                </Text>
            )}
        </Container>
    );
});

export default HomeDev;