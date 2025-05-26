mport React, { useEffect, useRef } from 'react';
import { animated, useSpring, config as springConfigs } from '@react-spring/web';
import { observer } from 'mobx-react-lite';
import { schedulerStore } from './ReactiveSpringPresence';

function RollingDigit({ place, value, height, digitStyle, digitConfig, digitSpring }: any) {
    const placeValue = Math.floor(Math.abs(value) / place) % 10;
    const [spring] = useSpring(() => ({ y: 0, config: digitSpring || springConfigs.wobbly }));

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
        width: digitConfig?.width || '1ch',
        fontVariantNumeric: 'tabular-nums',
        ...digitConfig?.style,
    };

    return (
        <div style={{ ...baseStyle, ...digitStyle }}>
            <animated.div style={{ transform: spring.y.to(y => `translateY(${y}px)`) }}>
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            height,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            ...digitConfig?.innerStyle,
                        }}
                    >
                        {i}
                    </div>
                ))}
            </animated.div>
        </div>
    );
}

function SymbolDigit({ char = '', height, digitStyle, digitConfig }: any) {
    return (
        <div
            style={{
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: digitConfig?.width || '1ch',
                fontVariantNumeric: 'tabular-nums',
                ...digitConfig?.style,
                ...digitStyle,
            }}
        >
            {char}
        </div>
    );
}

export const UltimateCounter = observer(({
                                             value = 0,
                                             fontSize = 80,
                                             padding = 8,
                                             gap = 6,
                                             digitStyle = {},
                                             digitConfig = {},
                                             digitSpring = undefined,
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
        ...(prefix ? [<SymbolDigit key="prefix" char={prefix} height={height} digitStyle={digitStyle} digitConfig={digitConfig} />] : []),
        ...(value < 0 ? [<SymbolDigit key="minus" char="−" height={height} digitStyle={digitStyle} digitConfig={digitConfig} />] : []),
        ...places.map((place: number, index: number) => (
            <RollingDigit
                key={place}
                place={place}
                value={absValue}
                height={height}
                digitStyle={digitStyle}
                digitConfig={digitConfig}
                digitSpring={digitSpring}
            />
        )),
        ...(hasDecimal ? [
            <SymbolDigit key="dot" char="." height={height} digitStyle={digitStyle} digitConfig={digitConfig} />,
            ...Array.from({ length: decimalPlaces }).map((_, i) => {
                const fraction = Math.floor(absValue * Math.pow(10, i + 1)) % 10;
                return (
                    <SymbolDigit key={`fraction-${i}`} char={fraction} height={height} digitStyle={digitStyle} digitConfig={digitConfig} />
                );
            })
        ] : []),
        ...(suffix ? [<SymbolDigit key="suffix" char={suffix} height={height} digitStyle={digitStyle} digitConfig={digitConfig} />] : []),
    ];

    return animatedContainer ? (
        <animated.div style={containerStyle}>{digits}</animated.div>
    ) : (
        <div style={containerStyle}>{digits}</div>
    );
});
``
