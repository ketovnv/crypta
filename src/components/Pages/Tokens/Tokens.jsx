import { observer } from 'mobx-react-lite';
import { Container, Title } from '@mantine/core';
import TokenOperations from './TokenOperations';
import { useAppKitAccount } from '@reown/appkit/react';

const TokenManagement = observer(() => {
    const { isConnected } = useAppKitAccount();

    return (
        <Container size="xl" w="75vw">
            <Title order={2} mb="xl">Управление токенами</Title>
            {isConnected ? (
                <TokenOperations />
            ) : (
                <Title order={3} c="dimmed">Подключите кошелёк для управления токенами</Title>
            )}
        </Container>
    );
});

export default TokenManagement;