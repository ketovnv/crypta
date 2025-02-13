// src/components/Layout/PageTransition.tsx
import { observer } from 'mobx-react-lite';
import { Transition } from '@mantine/core';
import { routerStore } from '../../stores/router.ts';

const TRANSITION_DURATION = 300;

// Определяем анимации для разных направлений
const TRANSITIONS = {
    'slide-right': {
        common: { transition: `transform ${TRANSITION_DURATION}ms ease, opacity ${TRANSITION_DURATION}ms ease` },
        entering: { transform: 'translateX(0)', opacity: 1 },
        exiting: { transform: 'translateX(-100%)', opacity: 0 },
    },
    'slide-left': {
        common: { transition: `transform ${TRANSITION_DURATION}ms ease, opacity ${TRANSITION_DURATION}ms ease` },
        entering: { transform: 'translateX(0)', opacity: 1 },
        exiting: { transform: 'translateX(100%)', opacity: 0 },
    },
    'slide-up': {
        common: { transition: `transform ${TRANSITION_DURATION}ms ease, opacity ${TRANSITION_DURATION}ms ease` },
        entering: { transform: 'translateY(0)', opacity: 1 },
        exiting: { transform: 'translateY(100%)', opacity: 0 },
    },
    'slide-down': {
        common: { transition: `transform ${TRANSITION_DURATION}ms ease, opacity ${TRANSITION_DURATION}ms ease` },
        entering: { transform: 'translateY(0)', opacity: 1 },
        exiting: { transform: 'translateY(-100%)', opacity: 0 },
    },
    'fade': {
        common: { transition: `opacity ${TRANSITION_DURATION}ms ease` },
        entering: { opacity: 1 },
        exiting: { opacity: 0 },
    },
};

export const PageTransition = observer(({ children }) => {
    const { currentMeta, isNavigating } = routerStore;
    const transition = TRANSITIONS[currentMeta.animation];

    return (
        <Transition
            mounted={!isNavigating}
            transition={transition}
            duration={TRANSITION_DURATION}
            timingFunction="ease"
        >
            {(styles) => (
                <div style={{ ...styles, width: '100%', height: '100%' }}>
                    {children}
                </div>
            )}
        </Transition>
    );
});