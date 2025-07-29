import React, { useRef, useMemo } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

// MobX Store для управления анимациями
class AnimatedSvgStore {
  isHovered = false;
  isActive = false;
  animationSpeed = 1;
  rotationEnabled = true;
  scaleEnabled = true;
  glowEnabled = true;
  morphEnabled = true;

  constructor() {
    makeAutoObservable(this);
  }

  setHovered(value) {
    this.isHovered = value;
  }

  setActive(value) {
    this.isActive = value;
  }

  toggleRotation() {
    this.rotationEnabled = !this.rotationEnabled;
  }

  toggleScale() {
    this.scaleEnabled = !this.scaleEnabled;
  }

  toggleGlow() {
    this.glowEnabled = !this.glowEnabled;
  }

  toggleMorph() {
    this.morphEnabled = !this.morphEnabled;
  }

  setAnimationSpeed(speed) {
    this.animationSpeed = speed;
  }
}

const svgStore = new AnimatedSvgStore();

// Основной компонент для анимации SVG
const AnimatedSvgWrapper = observer(
  ({
    children,
    size = 200,
    primaryColor = "#3b82f6",
    secondaryColor = "#8b5cf6",
    animationType = "float",
    customAnimation = null,
  }) => {
    const svgRef = useRef(null);

    // Основная анимация при загрузке
    const [entranceProps, entranceApi] = useSpring(() => ({
      from: {
        opacity: 0,
        scale: 0.3,
        rotate: -180,
      },
      to: {
        opacity: 1,
        scale: 1,
        rotate: 0,
      },
      config: { ...config.gentle, duration: 1000 / svgStore.animationSpeed },
    }));

    // Анимация при наведении
    const [hoverProps, hoverApi] = useSpring(() => ({
      scale: svgStore.isHovered ? 1.1 : 1,
      rotate: svgStore.isHovered && svgStore.rotationEnabled ? 15 : 0,
      config: config.wobbly,
    }));

    // Плавающая анимация
    const floatProps = useSpring({
      from: { y: 0 },
      to: async (next) => {
        while (true) {
          await next({ y: -10 });
          await next({ y: 10 });
        }
      },
      config: { ...config.molasses, duration: 3000 / svgStore.animationSpeed },
    });

    // Пульсирующая анимация
    const pulseProps = useSpring({
      from: { scale: 1, opacity: 1 },
      to: async (next) => {
        while (true) {
          await next({ scale: 1.05, opacity: 0.8 });
          await next({ scale: 1, opacity: 1 });
        }
      },
      config: { ...config.slow, duration: 2000 / svgStore.animationSpeed },
    });

    // Вращающаяся анимация
    const spinProps = useSpring({
      from: { rotate: 0 },
      to: async (next) => {
        while (svgStore.rotationEnabled) {
          await next({ rotate: 360 });
          await next({ rotate: 0 });
        }
      },
      config: { duration: 8000 / svgStore.animationSpeed, easing: (t) => t },
    });

    // Градиентная анимация
    const [gradientProps] = useSpring(() => ({
      from: { x1: "0%", x2: "100%" },
      to: async (next) => {
        while (true) {
          await next({ x1: "100%", x2: "0%" });
          await next({ x1: "0%", x2: "100%" });
        }
      },
      config: { duration: 4000 / svgStore.animationSpeed },
    }));

    // Эффект свечения
    const glowProps = useSpring({
      from: { filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0))" },
      to: async (next) => {
        while (svgStore.glowEnabled) {
          await next({ filter: `drop-shadow(0 0 20px ${primaryColor}80)` });
          await next({ filter: `drop-shadow(0 0 30px ${secondaryColor}60)` });
          await next({ filter: "drop-shadow(0 0 10px rgba(59, 130, 246, 0))" });
        }
      },
      config: { duration: 2500 / svgStore.animationSpeed },
    });

    // Выбор типа анимации
    const getAnimationProps = () => {
      if (customAnimation) return customAnimation;

      switch (animationType) {
        case "float":
          return floatProps;
        case "pulse":
          return pulseProps;
        case "spin":
          return spinProps;
        default:
          return {};
      }
    };

    const animationProps = getAnimationProps();

    // Комбинированные стили
    const combinedStyle = {
      ...entranceProps,
      ...hoverProps,
      ...animationProps,
      ...(svgStore.glowEnabled ? glowProps : {}),
      scale: svgStore.scaleEnabled
        ? entranceProps.scale.to(
            (s) =>
              s *
              (hoverProps.scale?.get() || 1) *
              (animationProps.scale?.get() || 1),
          )
        : 1,
      rotate: svgStore.rotationEnabled
        ? entranceProps.rotate.to(
            (r) =>
              r +
              (hoverProps.rotate?.get() || 0) +
              (animationProps.rotate?.get() || 0),
          )
        : 0,
    };

    return (
      <animated.div
        ref={svgRef}
        style={{
          ...combinedStyle,
          width: size,
          height: size,
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          transformOrigin: "center",
          willChange: "transform, opacity, filter",
        }}
        onMouseEnter={() => {
          svgStore.setHovered(true);
          hoverApi.start({
            scale: svgStore.scaleEnabled ? 1.1 : 1,
            rotate: svgStore.rotationEnabled ? 15 : 0,
          });
        }}
        onMouseLeave={() => {
          svgStore.setHovered(false);
          hoverApi.start({ scale: 1, rotate: 0 });
        }}
        onClick={() => {
          svgStore.setActive(!svgStore.isActive);
          entranceApi.start({
            from: { scale: 1, rotate: 0 },
            to: { scale: 0.8, rotate: 10 },
            config: config.stiff,
            onRest: () => {
              entranceApi.start({
                to: { scale: 1, rotate: 0 },
                config: config.wobbly,
              });
            },
          });
        }}
      >
        {React.cloneElement(children, {
          width: "100%",
          height: "100%",
          style: { ...children.props.style },
        })}
      </animated.div>
    );
  },
);

// Контрольная панель для демонстрации
const AnimationControls = observer(() => {
  return (
    <div className="fixed top-4 right-4 bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white">
      <h3 className="text-lg font-bold mb-4 text-center">
        Управление анимацией
      </h3>

      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={svgStore.rotationEnabled}
            onChange={() => svgStore.toggleRotation()}
            className="w-4 h-4"
          />
          <span className="text-sm">Вращение</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={svgStore.scaleEnabled}
            onChange={() => svgStore.toggleScale()}
            className="w-4 h-4"
          />
          <span className="text-sm">Масштабирование</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={svgStore.glowEnabled}
            onChange={() => svgStore.toggleGlow()}
            className="w-4 h-4"
          />
          <span className="text-sm">Свечение</span>
        </label>

        <div className="pt-3 border-t border-white/10">
          <label className="text-sm block mb-2">Скорость анимации</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={svgStore.animationSpeed}
            onChange={(e) =>
              svgStore.setAnimationSpeed(parseFloat(e.target.value))
            }
            className="w-full"
          />
          <span className="text-xs text-gray-400">
            x{svgStore.animationSpeed.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
});

// Демонстрационный компонент
export default function AnimatedSvgDemo() {
  const demoSvgs = [
    {
      name: "Звезда",
      animationType: "spin",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              id="starGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path
            d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z"
            fill="url(#starGradient)"
            stroke="white"
            strokeWidth="0.5"
          />
        </svg>
      ),
    },
    {
      name: "Сердце",
      animationType: "pulse",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="heartGradient">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </radialGradient>
          </defs>
          <path
            d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z"
            fill="url(#heartGradient)"
            stroke="white"
            strokeWidth="0.5"
          />
        </svg>
      ),
    },
    {
      name: "Молния",
      animationType: "float",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              id="boltGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <path
            d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
            fill="url(#boltGradient)"
            stroke="white"
            strokeWidth="0.5"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-white mb-12 text-center">
        Универсальный SVG аниматор на React Spring
      </h1>

      <div className="flex flex-wrap gap-12 justify-center mb-12">
        {demoSvgs.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-4">
            <AnimatedSvgWrapper
              size={150}
              animationType={item.animationType}
              primaryColor="#3b82f6"
              secondaryColor="#8b5cf6"
            >
              {item.svg}
            </AnimatedSvgWrapper>
            <span className="text-white/60 text-sm">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-2xl text-center">
        <p className="text-white/80">
          Этот компонент превращает любой SVG в красиво анимированный элемент.
          Просто оберните ваш SVG в{" "}
          <code className="bg-white/10 px-2 py-1 rounded">
            AnimatedSvgWrapper
          </code>
          и выберите тип анимации!
        </p>
      </div>

      <AnimationControls />
    </div>
  );
}
