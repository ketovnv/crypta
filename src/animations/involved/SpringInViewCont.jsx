import {
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const MAX_OVERFLOW = 50;

export default function ElasticSlider({
                                          defaultValue = 50,
                                          startingValue = 0,
                                          maxValue = 100,
                                          className = "",
                                          isStepped = false,
                                          stepSize = 1,
                                          leftIcon = <span>-</span>,
                                          rightIcon = <span>+</span>
                                      }) {
    return (
        <div className={`flex flex-col items-center justify-center  ${className}`}>
            <Slider
                defaultValue={defaultValue}
                startingValue={startingValue}
                maxValue={maxValue}
                isStepped={isStepped}
                stepSize={stepSize}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
            />
        </div>
    );
}

function Slider({
                    defaultValue,
                    startingValue,
                    maxValue,
                    isStepped,
                    stepSize,
                    leftIcon,
                    rightIcon,
                }) {
    const [value, setValue] = useState(defaultValue);
    const sliderRef = useRef(null);
    const [region, setRegion] = useState("middle");
    const clientX = useMotionValue(0);
    const overflow = useMotionValue(0);
    const scale = useMotionValue(1);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    useMotionValueEvent(clientX, "change", (latest) => {
        if (sliderRef.current) {
            const { left, right } = sliderRef.current.getBoundingClientRect();
            let newValue;

            if (latest < left) {
                setRegion("left");
                newValue = left - latest;
            } else if (latest > right) {
                setRegion("right");
                newValue = latest - right;
            } else {
                setRegion("middle");
                newValue = 0;
            }

            overflow.jump(decay(newValue, MAX_OVERFLOW));
        }
    });

    const handlePointerMove = (e) => {
        if (e.buttons > 0 && sliderRef.current) {
            const { left, width } = sliderRef.current.getBoundingClientRect();
            let newValue = startingValue + ((e.clientX - left) / width) * (maxValue - startingValue);

            if (isStepped) {
                newValue = Math.round(newValue / stepSize) * stepSize;
            }

            newValue = Math.min(Math.max(newValue, startingValue), maxValue);
            setValue(newValue);
            clientX.jump(e.clientX);
        }
    };

    const handlePointerDown = (e) => {
        handlePointerMove(e);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerUp = () => {
        animate(overflow, 0, { type: "spring", bounce: 0.5 });
    };

    const getRangePercentage = () => {
        const totalRange = maxValue - startingValue;
        if (totalRange === 0) return 0;
        return ((value - startingValue) / totalRange) * 100;
    };

    return (
        <>
            <motion.div
                onHoverStart={() => animate(scale, 1.2)}
                onHoverEnd={() => animate(scale, 1)}
                onTouchStart={() => animate(scale, 1.2)}
                onTouchEnd={() => animate(scale, 1)}
                style={{
                    scale,
                    opacity: useTransform(scale, [1, 1.2], [0.7, 1]),
                }}
                className="flex w-full touch-none select-none items-center justify-center gap-4"
            >
                <motion.div
                    animate={{
                        scale: region === "left" ? [1, 1.4, 1] : 1,
                        transition: { duration: 0.25 },
                    }}
                    style={{
                        x: useTransform(() =>
                            region === "left" ? -overflow.get() / scale.get() : 0,
                        ),
                    }}
                >
                    {leftIcon}
                </motion.div>

                <div
                    ref={sliderRef}
                    className="relative flex w-full max-w-xs flex-grow cursor-grab touch-none select-none items-center py-4"
                    onPointerMove={handlePointerMove}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                >
                    <motion.div
                        style={{
                            scaleX: useTransform(() => {
                                if (sliderRef.current) {
                                    const { width } = sliderRef.current.getBoundingClientRect();
                                    return 1 + overflow.get() / width;
                                }
                            }),
                            scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
                            transformOrigin: useTransform(() => {
                                if (sliderRef.current) {
                                    const { left, width } = sliderRef.current.getBoundingClientRect();
                                    return clientX.get() < left + width / 2 ? "right" : "left";
                                }
                            }),
                            height: useTransform(scale, [1, 1.2], [6, 12]),
                            marginTop: useTransform(scale, [1, 1.2], [0, -3]),
                            marginBottom: useTransform(scale, [1, 1.2], [0, -3]),
                        }}
                        className="flex flex-grow"
                    >
                        <div className="relative h-full flex-grow overflow-hidden rounded-full bg-gray-400">
                            <div
                                className="absolute h-full bg-gray-500 rounded-full"
                                style={{ width: `${getRangePercentage()}%` }}
                            />
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    animate={{
                        scale: region === "right" ? [1, 1.4, 1] : 1,
                        transition: { duration: 0.25 },
                    }}
                    style={{
                        x: useTransform(() =>
                            region === "right" ? overflow.get() / scale.get() : 0,
                        ),
                    }}
                >
                    {rightIcon}
                </motion.div>
            </motion.div>
            <p className="absolute text-gray-400 transform -translate-y-4 text-xs font-medium tracking-wide">
                {Math.round(value)}
            </p>
        </>
    );
}

function decay(value, max) {
    if (max === 0) {
        return 0;
    }

    const entry = value / max;
    const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);

    return sigmoid * max;
}




// SpringInViewContentPrev.tsx
import React from 'react';
import { animated, useSpring, useInView, config as springConfigs } from '@react-spring/web';
import { observer } from 'mobx-react-lite';
import { schedulerStore } from './ReactiveSpringPresence';

// Политика глобальной анимации
export const animationPolicyStore = {
    globalDelay: 0,
    globalStagger: 0,
    globalEnabled: true,

    setPolicy({ delay, stagger, enabled }: { delay?: number; stagger?: number; enabled?: boolean }) {
        if (delay !== undefined) this.globalDelay = delay;
        if (stagger !== undefined) this.globalStagger = stagger;
        if (enabled !== undefined) this.globalEnabled = enabled;
    },
};

export type SpringInViewContentPrevProps = {
    children: React.ReactNode;
    distance?: number;
    direction?: 'vertical' | 'horizontal';
    reverse?: boolean;
    config?: any;
    initialOpacity?: number;
    animateOpacity?: boolean;
    scale?: number;
    delay?: number;
    threshold?: number;
    className?: string;
    style?: React.CSSProperties;
    autoRegister?: boolean; // для включения централизованного управления
    index?: number; // позиция в списке для stagger
};

const SpringInViewContentPrev = observer(({
                                              children,
                                              distance = 100,
                                              direction = 'vertical',
                                              reverse = false,
                                              config = springConfigs.default,
                                              initialOpacity = 0,
                                              animateOpacity = true,
                                              scale = 1,
                                              delay = 0,
                                              threshold = 0.1,
                                              className,
                                              style = {},
                                              autoRegister = true,
                                              index = 0,
                                          }: SpringInViewContentProps) => {
    const [ref, inView] = useInView({
        rootMargin: '0px',
        amount: threshold,
        once: true,
    });

    const axis = direction === 'horizontal' ? 'X' : 'Y';
    const offset = reverse ? -distance : distance;

    const effectiveDelay =
        delay + animationPolicyStore.globalDelay + index * animationPolicyStore.globalStagger;

    const spring = useSpring({
        from: {
            transform: `translate${axis}(${offset}px) scale(${scale})`,
            opacity: animateOpacity ? initialOpacity : 1,
        },
        to: inView && animationPolicyStore.globalEnabled
            ? {
                transform: 'translate(0px, 0px) scale(1)',
                opacity: 1,
            }
            : undefined,
        config,
        delay: effectiveDelay,
    });

    // Централизованная регистрация на каждом кадре (опционально)
    React.useEffect(() => {
        if (!autoRegister) return;
        const step = () => {};
        schedulerStore.add(step);
        return () => schedulerStore.remove(step);
    }, [autoRegister]);

    return (
        <animated.div ref={ref} style={{ ...spring, ...style }} className={className}>
            {children}
        </animated.div>
    );
});

export default SpringInViewContentPrev
