import { observer } from 'mobx-react-lite';
import { Container, Title } from '@mantine/core';
import { BalanceTracker } from './BalanceTracker';
import { walletStore  }  from '@/stores/wallet';

const Balance = observer(() => {

    return (
        <Container size="xl" w="75vw">
            <Title order={2} mb="xl">Управление токенами</Title>
            {/*{walletStore.getAccountData() ? (*/}
            {/*    <TokenOperations />*/}
            {/*) : (*/}
            {/*    <Title order={3} c="dimmed">Подключите кошелёк для управления токенами</Title>*/}
            {/*)}*/}
        </Container>
    );
});

export default Balance;
