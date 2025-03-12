import React from 'react';
import { observer } from 'mobx-react-lite';
import {  useBalance, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { Paper, Text, Group, Stack, Button, Badge } from '@mantine/core';


import {
    useAppKit,
    useAppKitNetwork,
    useAppKitState,
    useAppKitAccount,
    useWalletInfo,
    useDisconnect
} from '@reown/appkit/react';


// Конфигурация адресов USDT для разных сетей
const USDT_ADDRESSES = {
    // Основная сеть Ethereum
    '1': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    // Тестовая сеть Sepolia (пример адреса, нужно заменить на реальный)
    '11155111': '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06'
} as const;

// Минимальный ABI для чтения баланса ERC20
const ERC20_ABI = [
    {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function'
    }
];

const BalanceTracker = observer(() => {
    // Получаем информацию о подключенном кошельке
    const { address, isConnected } = useAppKitAccount();

    // Получаем информацию о текущей сети
    const { chainId } = useAppKitNetwork();

    // Определяем адрес USDT в зависимости от сети
    const usdtAddress = chainId ? USDT_ADDRESSES[chainId as keyof typeof USDT_ADDRESSES] : undefined;

    // Получаем баланс нативного токена (ETH)
    const balance
        // { data: nativeBalance, isLoading: isLoadingNative }
            = useBalance({
        address : usdtAddress,
        // watch: true,
        // enabled: isConnected && !!address,
    });

    // Получаем баланс USDT
    const data = useReadContract (
        // contracts: [
            {
                address: usdtAddress,
                abi: ERC20_ABI,
                functionName: 'balanceOf',
                args: [address as `0x${string}`],
            }
            // {
            //     address: usdtAddress,
            //     abi: ERC20_ABI,
            //     functionName: 'decimals',
            // }
        // ],
    );
    //
    // // Форматируем баланс USDT
    // const formatUSDTBalance = () => {
    //     if (!tokenData || !tokenData[0] || !tokenData[1]) return '0';
    //     const balance = tokenData[0].result as bigint;
    //     const decimals = tokenData[1].result as number;
    //     return formatUnits(balance, decimals);
    // };

    return (
        <Stack shadow="sm" p="lg" radius="md" withBorder>
            {/*{loggerStore.renderJSON('ReadContreact', data)}*/}
            <LogJSON label="Read Contract" json={data}/>
            {/*<Stack spacing="md">*/}
            {/*    <Group position="apart">*/}
            {/*        <Text size="xl" weight={500}>Балансы</Text>*/}
            {/*        <Badge color={chain?.testnet ? 'yellow' : 'blue'}>*/}
            {/*            {chain?.name || 'Не подключено'}*/}
            {/*        </Badge>*/}
            {/*    </Group>*/}

            {/*    {isConnected ? (*/}
            {/*        <>*/}
            {/*            <Group position="apart">*/}
            {/*                <Text>Нативный токен ({chain?.nativeCurrency.symbol}):</Text>*/}
            {/*                <Text weight={500}>*/}
            {/*                    {isLoadingNative ? 'Загрузка...' :*/}
            {/*                        `${nativeBalance?.formatted || '0'} ${nativeBalance?.symbol}`}*/}
            {/*                </Text>*/}
            {/*            </Group>*/}

            {/*            <Group position="apart">*/}
            {/*                <Text>USDT:</Text>*/}
            {/*                <Text weight={500}>*/}
            {/*                    {isLoadingToken ? 'Загрузка...' :*/}
            {/*                        `${formatUSDTBalance()} USDT`}*/}
            {/*                </Text>*/}
            {/*            </Group>*/}

            {/*            {!usdtAddress && (*/}
            {/*                <Text color="red" size="sm">*/}
            {/*                    USDT не поддерживается в текущей сети*/}
            {/*                </Text>*/}
            {/*            )}*/}
            {/*        </>*/}
            {/*    ) : (*/}
            {/*        <Text color="dimmed">Подключите кошелек для просмотра балансов</Text>*/}
            {/*    )}*/}
            {/*</Stack>*/}
        </Stack>
    );
});

export default BalanceTracker;
