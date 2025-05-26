// SpringInViewContent.tsx
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

export type SpringInViewContentProps = {
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

const SpringInViewContent = observer(({
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

export default SpringInViewContent;
