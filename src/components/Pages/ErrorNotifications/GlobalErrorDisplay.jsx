// components/GlobalErrorDisplay.jsx
import { observer } from 'mobx-react-lite';
import { Stack, Notification } from '@mantine/core';
import { errorStore } from '@/stores/errors';

export const GlobalErrorDisplay = observer(() => {
    console.log('Rendering GlobalErro   rDisplay, errors:', errorStore.activeErrors);

    return (
        <Stack
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 9999,
                maxWidth: '400px'
            }}
        >
            {errorStore.activeErrors.map((error) => (
                <Notification
                    key={error.id}
                    color={error.level === 'error' ? 'red' : 'yellow'}
                    title={error.type}
                    onClose={() => errorStore.removeError(error.id)}
                >
                    {error.message}
                    {error.details && process.env.NODE_ENV === 'development' && (
                        <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.7 }}>
                            {error.details}
                        </div>
                    )}
                </Notification>
            ))}
        </Stack>
    );
});