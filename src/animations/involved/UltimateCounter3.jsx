// UltimateCounter.tsx
import React, { useEffect, useRef, useState } from 'react';
import { animated, useSpring, config as springConfigs } from '@react-spring/web';
import { observer } from 'mobx-react-lite';
import { schedulerStore } from './ReactiveSpringPresence';

function RollingDigit({ place, value, height, digitStyle }: any) {
    const placeValue = Math.floor(Math.abs(value) / place) % 10;
    const [spring] = useSpring(() => ({ y: 0, config: springConfigs.wobbly }));

    useEffect(() => {
        spring.start({ y: -placeValue * height });
    }, [value, placeValue, height]);

    useEffect(() => {
        const update = () => {};
        schedulerStore.add(update);
        return () => schedulerStore.remove(update);
    }, []);

    const baseStyle = {
        position: 'relative',
        height,
        overflow: 'hidden',
        width: '1ch',
        fontVariantNumeric: 'tabular-nums',
    };

    return (
        <div style={{ ...baseStyle, ...digitStyle }}>
            <animated.div style={{ transform: spring.y.to(y => `translateY(${y}px)`) }}>
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {i}
                    </div>
                ))}
            </animated.div>
        </div>
    );
}

function SymbolDigit({ char = '', height, digitStyle }: any) {
    return (
        <div
            style={{
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...digitStyle,
            }}
        >
            {char}
        </div>
    );
}

export const UltimateCounter = observer(({
                                             value: controlledValue,
                                             fontSize = 80,
                                             padding = 8,
                                             gap = 6,
                                             digitStyle = {},
                                             style = {},
                                             animatedContainer = true,
                                             config = springConfigs.wobbly,
                                             places = [100, 10, 1],
                                             showDecimal = false,
                                             decimalPlaces = 2,
                                             prefix = '',
                                             suffix = '',
                                             spinning = false,
                                             spinSpeed = 50,
                                             autoStart = false,
                                             onTick,
                                             onNetworkEvent,
                                             controlRef,
                                         }: any) => {
    const height = fontSize + padding;
    const [internalValue, setInternalValue] = useState(controlledValue ?? 0);
    const value = controlledValue ?? internalValue;
    const absValue = Math.abs(value);
    const hasDecimal = showDecimal && decimalPlaces > 0;
    const spinRef = useRef<number | null>(null);

    useEffect(() => {
        if (!spinning || !autoStart) return;

        const tick = () => {
            setInternalValue(v => v + 1);
            if (onTick) onTick();
            spinRef.current = requestAnimationFrame(tick);
        };

        spinRef.current = requestAnimationFrame(tick);
        return () => {
            if (spinRef.current) cancelAnimationFrame(spinRef.current);
        };
    }, [spinning, autoStart]);

    useEffect(() => {
        if (!onNetworkEvent) return;
        const handler = (e: CustomEvent) => {
            const delta = e.detail?.delta ?? 1;
            setInternalValue(v => v + delta);
        };
        window.addEventListener('counter-network-event', handler as EventListener);
        return () => window.removeEventListener('counter-network-event', handler as EventListener);
    }, [onNetworkEvent]);

    useEffect(() => {
        if (!controlRef) return;
        controlRef.current = {
            set: (v: number) => setInternalValue(v),
            reset: () => setInternalValue(0),
            increment: (step: number = 1) => setInternalValue(v => v + step),
            decrement: (step: number = 1) => setInternalValue(v => v - step),
        };
    }, [controlRef]);

    const containerStyle = {
        display: 'flex',
        gap,
        fontSize,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        overflow: 'hidden',
        ...style,
    };

    const digits = [
        ...(prefix ? [<SymbolDigit key="prefix" char={prefix} height={height} digitStyle={digitStyle} />] : []),
        ...(value < 0 ? [<SymbolDigit key="minus" char="−" height={height} digitStyle={digitStyle} />] : []),
        ...places.map((place: number, index: number) => (
            <RollingDigit
                key={place}
                place={place}
                value={absValue}
                height={height}
                digitStyle={digitStyle}
            />
        )),
        ...(hasDecimal ? [
            <SymbolDigit key="dot" char="." height={height} digitStyle={digitStyle} />,
            ...Array.from({ length: decimalPlaces }).map((_, i) => {
                const fraction = Math.floor(absValue * Math.pow(10, i + 1)) % 10;
                return (
                    <SymbolDigit key={`fraction-${i}`} char={fraction} height={height} digitStyle={digitStyle} />
                );
            })
        ] : []),
        ...(suffix ? [<SymbolDigit key="suffix" char={suffix} height={height} digitStyle={digitStyle} />] : []),
    ];

    return animatedContainer ? (
        <animated.div style={containerStyle}>{digits}</animated.div>
    ) : (
        <div style={containerStyle}>{digits}</div>
    );
});








// UltimateCounter.tsx
import React, { useEffect, useRef } from 'react';
import { animated, useSpring, config as springConfigs } from '@react-spring/web';
import { observer } from 'mobx-react-lite';
import { schedulerStore } from './ReactiveSpringPresence';

function RollingDigit({ place, value, height, digitStyle }: any) {
    const placeValue = Math.floor(Math.abs(value) / place) % 10;
    const [spring] = useSpring(() => ({ y: 0, config: springConfigs.wobbly }));

    useEffect(() => {
        spring.start({ y: -placeValue * height });
    }, [value, placeValue, height]);

    useEffect(() => {
        const update = () => {};
        schedulerStore.add(update);
        return () => schedulerStore.remove(update);
    }, []);

    const baseStyle = {
        position: 'relative',
        height,
        overflow: 'hidden',
        width: '1ch',
        fontVariantNumeric: 'tabular-nums',
    };

    return (
        <div style={{ ...baseStyle, ...digitStyle }}>
            <animated.div style={{ transform: spring.y.to(y => `translateY(${y}px)`) }}>
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {i}
                    </div>
                ))}
            </animated.div>
        </div>
    );
}

function SymbolDigit({ char = '', height, digitStyle }: any) {
    return (
        <div
            style={{
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...digitStyle,
            }}
        >
            {char}
        </div>
    );
}

export const UltimateCounterPrev = observer(({
                                             value = 0,
                                             fontSize = 80,
                                             padding = 8,
                                             gap = 6,
                                             digitStyle = {},
                                             style = {},
                                             animatedContainer = true,
                                             config = springConfigs.wobbly,
                                             places = [100, 10, 1],
                                             showDecimal = false,
                                             decimalPlaces = 2,
                                             prefix = '',
                                             suffix = '',
                                             spinning = false,
                                             spinSpeed = 50,
                                             autoStart = false,
                                             onTick,
                                         }: any) => {
    const height = fontSize + padding;
    const absValue = Math.abs(value);
    const hasDecimal = showDecimal && decimalPlaces > 0;
    const spinRef = useRef<number | null>(null);

    useEffect(() => {
        if (!spinning || !autoStart) return;

        const tick = () => {
            if (onTick) onTick();
            spinRef.current = requestAnimationFrame(tick);
        };

        spinRef.current = requestAnimationFrame(tick);
        return () => {
            if (spinRef.current) cancelAnimationFrame(spinRef.current);
        };
    }, [spinning, autoStart]);

    const containerStyle = {
        display: 'flex',
        gap,
        fontSize,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        overflow: 'hidden',
        ...style,
    };

    const digits = [
        ...(prefix ? [<SymbolDigit key="prefix" char={prefix} height={height} digitStyle={digitStyle} />] : []),
        ...(value < 0 ? [<SymbolDigit key="minus" char="−" height={height} digitStyle={digitStyle} />] : []),
        ...places.map((place: number, index: number) => (
            <RollingDigit
                key={place}
                place={place}
                value={absValue}
                height={height}
                digitStyle={digitStyle}
            />
        )),
        ...(hasDecimal ? [
            <SymbolDigit key="dot" char="." height={height} digitStyle={digitStyle} />,
            ...Array.from({ length: decimalPlaces }).map((_, i) => {
                const fraction = Math.floor(absValue * Math.pow(10, i + 1)) % 10;
                return (
                    <SymbolDigit key={`fraction-${i}`} char={fraction} height={height} digitStyle={digitStyle} />
                );
            })
        ] : []),
        ...(suffix ? [<SymbolDigit key="suffix" char={suffix} height={height} digitStyle={digitStyle} />] : []),
    ];

    return animatedContainer ? (
        <animated.div style={containerStyle}>{digits}</animated.div>
    ) : (
        <div style={containerStyle}>{digits}</div>
    );
});
