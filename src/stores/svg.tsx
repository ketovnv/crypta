import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useSpring, animated, config, useSpringValue, useTrail } from '@react-spring/web';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

// Утилита для работы с oklch цветами
const oklch = (l, c, h, a = 1) => `oklch(${l} ${c} ${h} / ${a * 100}%)`;

// Предустановленные oklch цвета
const colors = {
  primary: oklch(0.75, 0.18, 265, 1),
  secondary: oklch(0.65, 0.25, 320, 1),
  accent: oklch(0.85, 0.15, 90, 1),
  glow: oklch(0.90, 0.20, 200, 0.5),
  particle: oklch(0.95, 0.10, 180, 0.8),
  gradient1: oklch(0.70, 0.25, 280, 1),
  gradient2: oklch(0.80, 0.20, 120, 1),
  gradient3: oklch(0.60, 0.30, 30, 1)
};

// MobX Store для управления анимациями
class AnimationStore {
  activeAnimations = new Set();
  globalSpeed = 1;
  particlesEnabled = true;
  morphEnabled = true;
  pathAnimationEnabled = true;
  threeDEnabled = true;
  complexGradientsEnabled = true;

  constructor() {
    makeAutoObservable(this);
  }

  toggleAnimation(name) {
    if (this.activeAnimations.has(name)) {
      this.activeAnimations.delete(name);
    } else {
      this.activeAnimations.add(name);
    }
  }

  setGlobalSpeed(speed) {
    this.globalSpeed = speed;
  }

  toggleParticles() {
    this.particlesEnabled = !this.particlesEnabled;
  }

  toggleMorph() {
    this.morphEnabled = !this.morphEnabled;
  }

  togglePathAnimation() {
    this.pathAnimationEnabled = !this.pathAnimationEnabled;
  }

  toggle3D() {
    this.threeDEnabled = !this.threeDEnabled;
  }

  toggleComplexGradients() {
    this.complexGradientsEnabled = !this.complexGradientsEnabled;
  }
}

const animationStore = new AnimationStore();

// Компонент для морфинга SVG путей
const SvgMorphAnimation = observer(({
                                      paths,
                                      duration = 3000,
                                      color = colors.primary
                                    }) => {
  const [pathIndex, setPathIndex] = useState(0);

  const morphProps = useSpring({
    from: { t: 0 },
    to: { t: 1 },
    loop: true,
    config: { duration: duration / animationStore.globalSpeed },
    onRest: () => {
      setPathIndex((prev) => (prev + 1) % paths.length);
    }
  });

  const currentPath = paths[pathIndex];
  const nextPath = paths[(pathIndex + 1) % paths.length];

  // Интерполяция между путями
  const interpolatedPath = morphProps.t.to((t) => {
    if (!animationStore.morphEnabled) return currentPath;

    // Простая линейная интерполяция для демонстрации
    // В реальном проекте лучше использовать flubber или похожую библиотеку
    return currentPath;
  });

  return (
      <animated.svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <filter id="morphGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <animated.path
            d={currentPath}
            fill={color}
            filter="url(#morphGlow)"
            opacity={0.9}
        />
      </animated.svg>
  );
});

// Компонент для анимации по траектории
const PathFollowAnimation = observer(({
                                        children,
                                        path,
                                        duration = 5000,
                                        repeat = true
                                      }) => {
  const [offset, setOffset] = useState(0);
  const pathRef = useRef(null);

  const followProps = useSpring({
    from: { offset: 0 },
    to: { offset: 1 },
    loop: repeat,
    config: { duration: duration / animationStore.globalSpeed },
    onChange: ({ value }) => {
      if (!animationStore.pathAnimationEnabled || !pathRef.current) return;

      const pathLength = pathRef.current.getTotalLength();
      const point = pathRef.current.getPointAtLength(pathLength * value.offset);
      setOffset({ x: point.x, y: point.y });
    }
  });

  return (
      <svg viewBox="0 0 200 200" className="w-full h-full absolute">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.gradient1} />
            <stop offset="50%" stopColor={colors.gradient2} />
            <stop offset="100%" stopColor={colors.gradient3} />
          </linearGradient>
        </defs>
        <path
            ref={pathRef}
            d={path}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="2"
            opacity="0.3"
        />
        <animated.g
            transform={followProps.offset.to(o =>
                `translate(${offset.x || 0}, ${offset.y || 0})`
            )}
        >
          {children}
        </animated.g>
      </svg>
  );
});

// Компонент для particle эффектов
const ParticleEffect = observer(({
                                   count = 20,
                                   origin = { x: 50, y: 50 },
                                   spread = 50
                                 }) => {
  const particles = useMemo(() =>
          Array.from({ length: count }, (_, i) => ({
            id: i,
            angle: (360 / count) * i,
            delay: i * 50,
            color: oklch(
                0.85 + Math.random() * 0.15,
                0.15 + Math.random() * 0.10,
                Math.random() * 360,
                0.8
            )
          })),
      [count]
  );

  const trail = useTrail(particles.length, {
    from: {
      x: origin.x,
      y: origin.y,
      scale: 0,
      opacity: 1
    },
    to: async (next) => {
      if (!animationStore.particlesEnabled) return;

      while (true) {
        await next({
          x: origin.x + (Math.random() - 0.5) * spread,
          y: origin.y + (Math.random() - 0.5) * spread,
          scale: Math.random() * 1.5 + 0.5,
          opacity: 0
        });
        await next({
          x: origin.x,
          y: origin.y,
          scale: 0,
          opacity: 1
        });
      }
    },
    config: { duration: 2000 / animationStore.globalSpeed }
  });

  return (
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="particleGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {trail.map((props, index) => (
            <animated.circle
                key={particles[index].id}
                cx={props.x}
                cy={props.y}
                r={props.scale.to(s => s * 2)}
                fill={particles[index].color}
                opacity={props.opacity}
                filter="url(#particleGlow)"
            />
        ))}
      </svg>
  );
});

// Компонент для 3D трансформаций
const ThreeDTransform = observer(({ children, intensity = 1 }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const threeDProps = useSpring({
    transform: animationStore.threeDEnabled
        ? `perspective(1000px) rotateX(${rotation.x * intensity}deg) rotateY(${rotation.y * intensity}deg)`
        : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    config: config.gentle
  });

  const handleMouseMove = (e) => {
    if (!containerRef.current || !animationStore.threeDEnabled) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setRotation({
      x: (y - 0.5) * 20,
      y: (x - 0.5) * -20
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
      <animated.div
          ref={containerRef}
          style={{
            ...threeDProps,
            transformStyle: 'preserve-3d',
            width: '100%',
            height: '100%'
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
      >
        {children}
      </animated.div>
  );
});

// Компонент для сложных градиентных анимаций
const ComplexGradientAnimation = observer(({
                                             id = 'complexGradient',
                                             type = 'radial'
                                           }) => {
  const gradientProps = useSpring({
    from: {
      stop1: 0,
      stop2: 50,
      stop3: 100,
      rotation: 0,
      scale: 1
    },
    to: async (next) => {
      if (!animationStore.complexGradientsEnabled) return;

      while (true) {
        await next({
          stop1: 20,
          stop2: 60,
          stop3: 100,
          rotation: 180,
          scale: 1.5
        });
        await next({
          stop1: 0,
          stop2: 40,
          stop3: 80,
          rotation: 360,
          scale: 1
        });
        await next({
          stop1: 0,
          stop2: 50,
          stop3: 100,
          rotation: 0,
          scale: 1
        });
      }
    },
    config: { duration: 6000 / animationStore.globalSpeed }
  });

  if (type === 'radial') {
    return (
        <defs>
          <animated.radialGradient
              id={id}
              cx="50%"
              cy="50%"
              r={gradientProps.scale.to(s => `${s * 50}%`)}
              gradientTransform={gradientProps.rotation.to(r => `rotate(${r} 0.5 0.5)`)}
          >
            <animated.stop
                offset={gradientProps.stop1.to(s => `${s}%`)}
                stopColor={oklch(0.95, 0.20, 280, 1)}
            />
            <animated.stop
                offset={gradientProps.stop2.to(s => `${s}%`)}
                stopColor={oklch(0.75, 0.30, 120, 0.8)}
            />
            <animated.stop
                offset={gradientProps.stop3.to(s => `${s}%`)}
                stopColor={oklch(0.55, 0.25, 30, 0.6)}
            />
          </animated.radialGradient>
        </defs>
    );
  }

  return (
      <defs>
        <animated.linearGradient
            id={id}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientTransform={gradientProps.rotation.to(r => `rotate(${r} 0.5 0.5)`)}
        >
          <animated.stop
              offset={gradientProps.stop1.to(s => `${s}%`)}
              stopColor={oklch(0.85, 0.25, 200, 1)}
          />
          <animated.stop
              offset={gradientProps.stop2.to(s => `${s}%`)}
              stopColor={oklch(0.70, 0.30, 320, 0.9)}
          />
          <animated.stop
              offset={gradientProps.stop3.to(s => `${s}%`)}
              stopColor={oklch(0.60, 0.20, 60, 0.8)}
          />
        </animated.linearGradient>
      </defs>
  );
});

// Главный компонент-обертка
const AdvancedSvgAnimator = observer(({
                                        children,
                                        size = 200,
                                        enableParticles = true,
                                        enable3D = true,
                                        enableMorph = false,
                                        enablePathFollow = false,
                                        morphPaths = [],
                                        followPath = "",
                                        particleConfig = {}
                                      }) => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
      <div
          ref={containerRef}
          className="relative inline-block"
          style={{ width: size, height: size }}
          onMouseMove={handleMouseMove}
      >
        {enable3D ? (
            <ThreeDTransform intensity={1.5}>
              <div className="relative w-full h-full">
                {children}
                {enableParticles && animationStore.particlesEnabled && (
                    <ParticleEffect
                        origin={mousePos}
                        {...particleConfig}
                    />
                )}
              </div>
            </ThreeDTransform>
        ) : (
            <div className="relative w-full h-full">
              {children}
              {enableParticles && animationStore.particlesEnabled && (
                  <ParticleEffect
                      origin={mousePos}
                      {...particleConfig}
                  />
              )}
            </div>
        )}

        {enablePathFollow && followPath && (
            <PathFollowAnimation path={followPath} duration={5000}>
              <circle r="3" fill={colors.accent} />
            </PathFollowAnimation>
        )}

        {enableMorph && morphPaths.length > 0 && (
            <div className="absolute inset-0">
              <SvgMorphAnimation paths={morphPaths} />
            </div>
        )}
      </div>
  );
});

// Панель управления
const AnimationControlPanel = observer(() => {
  return (
      <div className="fixed top-4 right-4 bg-black/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 text-white w-80">
        <h3 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Управление анимациями
        </h3>

        <div className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                  type="checkbox"
                  checked={animationStore.particlesEnabled}
                  onChange={() => animationStore.toggleParticles()}
                  className="w-4 h-4 accent-purple-500"
              />
              <span className="text-sm group-hover:text-purple-300 transition-colors">
              Particle эффекты
            </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                  type="checkbox"
                  checked={animationStore.morphEnabled}
                  onChange={() => animationStore.toggleMorph()}
                  className="w-4 h-4 accent-purple-500"
              />
              <span className="text-sm group-hover:text-purple-300 transition-colors">
              Морфинг путей
            </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                  type="checkbox"
                  checked={animationStore.pathAnimationEnabled}
                  onChange={() => animationStore.togglePathAnimation()}
                  className="w-4 h-4 accent-purple-500"
              />
              <span className="text-sm group-hover:text-purple-300 transition-colors">
              Анимация по траектории
            </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                  type="checkbox"
                  checked={animationStore.threeDEnabled}
                  onChange={() => animationStore.toggle3D()}
                  className="w-4 h-4 accent-purple-500"
              />
              <span className="text-sm group-hover:text-purple-300 transition-colors">
              3D трансформации
            </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                  type="checkbox"
                  checked={animationStore.complexGradientsEnabled}
                  onChange={() => animationStore.toggleComplexGradients()}
                  className="w-4 h-4 accent-purple-500"
              />
              <span className="text-sm group-hover:text-purple-300 transition-colors">
              Сложные градиенты
            </span>
            </label>
          </div>

          <div className="pt-4 border-t border-white/10">
            <label className="text-sm block mb-3 text-gray-300">
              Глобальная скорость
            </label>
            <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={animationStore.globalSpeed}
                onChange={(e) => animationStore.setGlobalSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0.1x</span>
              <span className="text-purple-400 font-semibold">
              {animationStore.globalSpeed.toFixed(1)}x
            </span>
              <span>3.0x</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h4 className="text-sm mb-3 text-gray-300">Используемые цвета (oklch)</h4>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(colors).slice(0, 6).map(([name, color]) => (
                  <div
                      key={name}
                      className="h-8 rounded-lg border border-white/20"
                      style={{ backgroundColor: color }}
                      title={color}
                  />
              ))}
            </div>
          </div>
        </div>
      </div>
  );
});

// Демонстрационный компонент
export default function AdvancedSvgDemo() {
  const demoPath = "M 10 50 Q 50 10, 90 50 T 170 50";
  const morphPaths = [
    "M 20 50 Q 50 20, 80 50 T 80 50",
    "M 20 50 Q 50 80, 80 50 T 80 50",
    "M 20 50 L 50 20 L 80 50 L 50 80 Z"
  ];

  const DemoSvg = ({ gradientId }) => (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ComplexGradientAnimation id={gradientId} type="radial" />
        <circle
            cx="50"
            cy="50"
            r="30"
            fill={`url(#${gradientId})`}
            filter="drop-shadow(0 0 20px oklch(0.85 0.20 280 / 50%))"
        />
        <path
            d="M 50 20 L 60 40 L 80 40 L 65 55 L 70 75 L 50 60 L 30 75 L 35 55 L 20 40 L 40 40 Z"
            fill={oklch(0.95, 0.10, 60, 0.9)}
            filter="drop-shadow(0 0 10px oklch(0.90 0.15 60 / 70%))"
        />
      </svg>
  );

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Advanced SVG Animation System
          </h1>
          <p className="text-center text-gray-400 mb-12">
            Полный набор анимаций с oklch цветами и React Spring
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-white mb-4 font-semibold">3D Transform + Particles</h3>
              <AdvancedSvgAnimator
                  size={250}
                  enableParticles={true}
                  enable3D={true}
                  particleConfig={{ count: 15, spread: 80 }}
              >
                <DemoSvg gradientId="gradient1" />
              </AdvancedSvgAnimator>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-white mb-4 font-semibold">Path Following</h3>
              <AdvancedSvgAnimator
                  size={250}
                  enablePathFollow={true}
                  followPath={demoPath}
                  enable3D={false}
              >
                <DemoSvg gradientId="gradient2" />
              </AdvancedSvgAnimator>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-white mb-4 font-semibold">Morph Animation</h3>
              <AdvancedSvgAnimator
                  size={250}
                  enableMorph={true}
                  morphPaths={morphPaths}
                  enable3D={false}
              >
                <DemoSvg gradientId="gradient3" />
              </AdvancedSvgAnimator>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Особенности системы</h2>
            <ul className="space-y-2 text-gray-300">
              <li>✨ Все цвета в формате oklch с поддержкой альфа-канала</li>
              <li>🎯 MobX для управления состоянием всех анимаций</li>
              <li>🚀 Оптимизировано для 100+ FPS на мощных ПК</li>
              <li>🎨 Сложные градиентные анимации с динамическими остановками</li>
              <li>🌟 Particle эффекты следуют за курсором</li>
              <li>🔄 Морфинг SVG путей с плавными переходами</li>
              <li>📐 3D трансформации с отслеживанием мыши</li>
              <li>🛤️ Анимация объектов по заданной траектории</li>
            </ul>
          </div>
        </div>

        <AnimationControlPanel />
      </div>
  );
}