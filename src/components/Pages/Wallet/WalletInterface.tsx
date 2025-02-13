// src/components/WalletInterface.tsx
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import {
    Card,
    Text,
    Group,
    Stack,
    TextInput,
    Button,
    Skeleton,
    Transition,
    Paper
} from '@mantine/core';
import { useAppKitAccount } from '@reown/appkit/react';
import { walletStore } from '../../../stores/wallet.ts';
import { useTimeout } from '@mantine/hooks';

// Компонент для отображения баланса с анимацией
const BalanceDisplay = observer(({ symbol, balance, loading }: {
    symbol: string;
    balance: string;
    loading?: boolean;
}) => {
    // Анимация появления при загрузке данных
    const [shouldShow] = useTimeout(300);

    return (
        <Transition
            mounted={shouldShow()}
            transition="fade"
            duration={400}
        >
            {(styles) => (
                <Paper shadow="sm" p="md" style={styles}>
                    <Group position="apart">
                        <Text>{symbol}</Text>
                        {loading ? (
                            <Skeleton height={24} width={100} />
                        ) : (
                            <Text>{parseFloat(balance).toFixed(6)}</Text>
                        )}
                    </Group>
                </Paper>
            )}
        </Transition>
    );
});

export const WalletInterface = observer(() => {
    const { address, isConnected } = useAppKitAccount();
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');

    // Автоматическая загрузка балансов при подключении
    useEffect(() => {
        if (isConnected && address) {
            walletStore.fetchBalances();
        }
    }, [isConnected, address]);

    const handleSend = async () => {
        if (!amount || !recipientAddress) return;

        try {
            await walletStore.sendTransaction(recipientAddress, amount);
            // Очищаем форму после успешной отправки
            setRecipientAddress('');
            setAmount('');
        } catch (error) {
            console.error('Send failed:', error);
            // Здесь можно добавить обработку ошибок через notifications
        }
    };

    if (!isConnected) {
        return (
            <Card shadow="sm" p="lg">
                <Text align="center">Подключите кошелек для просмотра балансов</Text>
            </Card>
        );
    }

    return (
        <Card shadow="sm" p="lg">
            <Stack spacing="md">
                <Text size="xl" weight={500}>Балансы</Text>

                {/* Анимированное отображение балансов */}
                <Stack spacing="sm">
                    {Array.from(walletStore.balances.entries()).map(([key, balance]) => (
                        <BalanceDisplay
                            key={key}
                            symbol={balance.symbol}
                            balance={balance.balance}
                            loading={walletStore.isLoadingBalances}
                        />
                    ))}
                </Stack>

                {/* Форма отправки */}
                <TextInput
                    label="Адрес получателя"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="0x..."
                    disabled={walletStore.pendingTransactions.size > 0}
                />

                <TextInput
                    label="Сумма"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    disabled={walletStore.pendingTransactions.size > 0}
                />

                <Button
                    onClick={handleSend}
                    loading={walletStore.pendingTransactions.size > 0}
                    fullWidth
                >
                    {walletStore.pendingTransactions.size > 0 ? 'Отправка...' : 'Отправить'}
                </Button>
            </Stack>
        </Card>
    );
});