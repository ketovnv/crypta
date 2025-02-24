// components/observers/AppKitObserver.tsx
import { observer } from 'mobx-react-lite';
import { useAppKitAccount, useAppKitState } from '@reown/appkit/react';
import { rootStore } from './rootStore.ts';
import { useEffect } from 'react';

export const AppKitObserver = observer(() => {
    const account = useAppKitAccount();
    const state = useAppKitState();

    useEffect(() => {
        // Подписываемся на изменения аккаунта
        const unsubscribeAccount = account.subscribe((newData) => {
            rootStore.account.setAccountData(newData);
        });

        // Подписываемся на изменения состояния
        const unsubscribeState = state.subscribe((newData) => {
            rootStore.state.setStateData(newData);
        });

        // Добавляем подписки для автоматической очистки
        rootStore.account.addSubscription(unsubscribeAccount);
        rootStore.state.addSubscription(unsubscribeState);

        // Очищаем при размонтировании
        return () => {
            rootStore.cleanup();
        };
    }, []);

    return null;
});