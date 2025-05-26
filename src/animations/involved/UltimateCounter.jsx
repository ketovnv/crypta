// UltimateCounter.tsx
import React, {useEffect} from 'react';
import {animated, useSpring, config as springConfigs} from '@react-spring/web';
import {observer} from 'mobx-react-lite';

function RollingDigit({place, value, height, digitStyle}: any) {
    const placeValue = Math.floor(value / place) % 10;

    const [spring] = useSpring(() => ({
        y: 0,
        config: springConfigs.wobbly,
    }));

    useEffect(() => {
        const offset = -placeValue * height;
        spring.start({y: offset});
    }, [value, placeValue, height]);

    const baseStyle = {
        position: 'relative',
        height,
        overflow: 'hidden',
        width: '1ch',
        fontVariantNumeric: 'tabular-nums',
    };

    return (
        <div style={{...baseStyle, ...digitStyle}}>
            <animated.div style={{transform: spring.y.to(y => `translateY(${y}px)`)}}>
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        style={{height, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    >
                        {i}
                    </div>
                ))}
            </animated.div>
        </div>
    );
}

export const UltimateCounter = observer(({
                                             value = 0,
                                             fontSize = 80,
                                             padding = 8,
                                             places = [100, 10, 1],
                                             gap = 6,
                                             digitStyle = {},
                                             style = {},
                                             animatedContainer = true,
                                             config = springConfigs.wobbly,
                                         }: any) => {
    const height = fontSize + padding;

    const containerStyle = {
        display: 'flex',
        gap,
        fontSize,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        overflow: 'hidden',
        ...style,
    };

    const digits = places.map((place: number, index: number) => (
        <RollingDigit
            key={index}
            place={place}
            value={value}
            height={height}
            digitStyle={digitStyle}
        />
    ));

    return animatedContainer ? (
        <animated.div style={containerStyle}>{digits}</animated.div>
    ) : (
        <div style={containerStyle}>{digits}</div>
    );
});
