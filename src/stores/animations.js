import {
  baseAnimationSystem,
  useAnimation,
  createSpringAnimation,
} from "../animations/BaseAnimationSystem";
import { timeEngine } from "../stores/timeEngine";
import { gradientStore } from "../stores/gradient";
import { Controller } from "@react-spring/web";

// Сторы (реэкспорт для удобства)
export { timeEngine } from "../stores/timeEngine";
export { gradientStore } from "../stores/gradient";

// Дополнительные утилиты
const ANIMATION_PRESETS = {
  // Базовые пресеты
  instant: { tension: 1000, friction: 100, mass: 0.1 },
  snappy: { tension: 400, friction: 25, mass: 0.8 },
  gentle: { tension: 120, friction: 14, mass: 1 },
  wobbly: { tension: 180, friction: 12, mass: 1 },
  stiff: { tension: 210, friction: 20, mass: 1 },

  // Специализированные пресеты
  micro: { tension: 300, friction: 10, mass: 0.2 }, // Для микроанимаций
  page: { tension: 280, friction: 30, mass: 1.2 }, // Для переходов страниц
  modal: { tension: 250, friction: 22, mass: 1 }, // Для модальных окон
  theme: { tension: 150, friction: 18, mass: 1.5 }, // Для смены тем

  // Контекстуальные пресеты
  mobile: { tension: 200, friction: 25, mass: 1, clamp: true },
  desktop: { tension: 350, friction: 28, mass: 0.9 },
  reduced: { duration: 200, easing: "linear" }, // Для пользователей с ограничениями
};

const EASING_FUNCTIONS = {
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeIn: (t) => t * t * t,
  easeInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  elastic: (t) =>
    t === 0 || t === 1
      ? t
      : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI),
};

export const animations = { EASING_FUNCTIONS, ANIMATION_PRESETS };

// Главная функция для быстрого старта
export const initAnimationSystem = (config = {}) => {
  const {
    autoStart = true,
    targetFps = 60,
    vsync = true,
    timeScale = 1,
  } = config;

  if (autoStart) {
    startAnimationEngine();
  }

  if (targetFps !== 60) {
    timeEngine.setTargetFps(targetFps);
  }

  if (!vsync) {
    timeEngine.disableVSync();
  }

  if (timeScale !== 1) {
    timeEngine.setTimeScale(timeScale);
  }

  return {
    system: baseAnimationSystem,
    engine: timeEngine,
    metrics: getAnimationMetrics,
  };
};

// Экспорт по умолчанию - объект с основными функциями
export default {
  // Система
  system: baseAnimationSystem,
  engine: timeEngine,

  // Основные функции
  animate: animateElement,
  spring: animateWithSpring,
  css: animateWithCSS,
  gradient: animateWithGradient,

  // Управление
  start: startAnimationEngine,
  stop: stopAnimationEngine,
  pause: pauseAllAnimations,

  // Утилиты
  getTime: getAnimationTime,
  getFPS: getAnimationFPS,
  setSpeed: setAnimationSpeed,
  getMetrics: getAnimationMetrics,

  // Инициализация
  init: initAnimationSystem,

  // Пресеты
  presets: ANIMATION_PRESETS,
  easing: EASING_FUNCTIONS,
};

export const animateWithSpring = (element, values, config = {}) => {
  return animateElement(element, values, {
    type: "spring",
    tension: config.tension || 180,
    friction: config.friction || 20,
    mass: config.mass || 1,
    ...config,
  });
};

export const animateWithTailwindCss = (element, values, config = {}) => {
  return animateElement(element, values, {
    type: "tailwindcss",
    duration: config.duration || 1000,
    easing: config.easing || "ease-out",
    ...config,
  });
};

export const animateWithCSS = (element, values, config = {}) => {
  return animateElement(element, values, {
    type: "css",
    duration: config.duration || 1000,
    easing: config.easing || "ease-out",
    ...config,
  });
};

// Интеграция с градиентами

const animateElement = (element, target, config) => {
  return null;
};
export const animateWithGradient = (element, target, config = {}) => {
  if (!element) return null;

  const theme = gradientStore.getTheme;
  element.style.background = theme.background;
  element.style.color = theme.color;

  return animateElement(element, target, config);
};

// Утилиты времени
export const getAnimationTime = () => timeEngine.elapsedTime;
export const getAnimationFPS = () => timeEngine.fps;
export const setAnimationSpeed = (scale) => timeEngine.setTimeScale(scale);

// Управление системой
export const startAnimationEngine = () => {
  if (!timeEngine.isRunning) {
    timeEngine.start();
  }
};

export const stopAnimationEngine = () => {
  timeEngine.stop();
};

export const pauseAllAnimations = () => {
  baseAnimationSystem.stopAllAnimations();
};

// Метрики
export const getAnimationMetrics = () => ({
  ...baseAnimationSystem.getMetrics(),
  elapsedTime: timeEngine.elapsedTime,
  timeScale: timeEngine.timeScale,
});

// React хук для полной интеграции
export const useQuickAnimation = (config = {}) => {
  const { start, stop } = useAnimation({
    tension: 200,
    friction: 20,
    ...config,
  });

  return {
    animate: start,
    stop,
    animateWithGradient: (element, target) => {
      if (element && gradientStore.getTheme) {
        const theme = gradientStore.getTheme;
        element.style.background = theme.background;
      }
      return start(element, target);
    },
  };
};

const createSmartController = (
  name,
  initialVals,
  type = "notSmart",
  setter = null,
  preset = "gentle",
  opts = {},
) => {
  const ctrl = new Controller({
    ...initialVals,
    config: this.config.get(preset, opts.config),
    ...opts,
  });
  const api =
    type === "smart"
      ? {
          name,
          controller: ctrl,
          to: (vals, c) => {
            this.active.add(name);
            return ctrl
              .start({ to: vals, config: c ?? ctrl.springs.config })
              .finally(() => this.active.delete(name));
          },
          get springs() {
            return ctrl.springs;
          },
          getValues: () => ctrl.get(),
          sequence: async (steps) => {
            for (const step of steps) {
              await ctrl.start(step);
              if (step.delay)
                await new Promise((r) => setTimeout(r, step.delay));
            }
          },
          pause: () => ctrl.pause(),
          resume: () => ctrl.resume(),
          stop: () => ctrl.stop(),
          dispose: () => {
            ctrl.stop();
            setter?.unset && setter.unset(name);
          },
        }
      : { name, ctrl };

  setter?.set && setter.set(api);
  return api;
};

/**
 * Приостанавливает все анимации, которые невидимы
 */
const optimizeVisibility = (visibilityMap) => {
  this.animations.forEach((animation, id) => {
    const shouldBeActive = visibilityMap[id] !== false;

    if (animation.active && !shouldBeActive) {
      // Приостанавливаем неактивные анимации
      if (animation.type === "spring") {
        animation.instance.pause();
      } else if (animation.type === "controller") {
        animation.instance.pause();
      }
      animation.active = false;
    } else if (!animation.active && shouldBeActive) {
      // Возобновляем активные анимации
      if (animation.type === "spring") {
        animation.instance.resume();
      } else if (animation.type === "controller") {
        animation.instance.resume();
      }
      animation.active = true;
    }
  });
};

// Инициализация при импорте
if (typeof window !== "undefined") {
  startAnimationEngine();
}
