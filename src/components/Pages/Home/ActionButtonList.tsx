import { observer } from 'mobx-react-lite';
import { Button, Group } from '@mantine/core';
import { walletStore } from '@/stores/wallet.ts';

export const ActionButtonList = observer(() => {
    return (
        <Group spacing="md">
            <Button
                onClick={walletStore.openModal}
                loading={walletStore.loading}
            >
                Открыть
            </Button>

            {walletStore.isConnected && (
                <>
                    <Button
                        onClick={() => walletStore.disconnect()}
                        variant="outline"
                        color="red"
                    >
                        Отключить
                    </Button>

                    <Button
                        onClick={() => walletStore.switchNetwork(1)}
                        variant="light"
                        disabled={walletStore.loading}
                    >
                        Переключить сеть
                    </Button>
                </>
            )}
        </Group>
    );
});