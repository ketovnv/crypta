import { makeAutoObservable } from "mobx";
import { timeEngine } from "../stores/timeEngine";
import { Globals } from "@react-spring/web";

class BaseAnimationSystem {
  constructor() {
    this.isInitialized = false;
    this.activeAnimations = new Map();
    this.animationId = 0;

    makeAutoObservable(this);
    this.initialize();
  }

  initialize() {
    if (this.isInitialized) return;

    // Интегрируем React Spring с нашим timeEngine
    this.setupReactSpringIntegration();

    // Запускаем timeEngine если он не запущен
    if (!timeEngine.isRunning) {
      timeEngine.start();
    }

    this.isInitialized = true;
    console.log("BaseAnimationSystem initialized");
  }

  setupReactSpringIntegration() {
    const originalRAF = Globals.requestAnimationFrame;
    const originalCAF = Globals.cancelAnimationFrame;

    Globals.requestAnimationFrame = (callback) => {
      const id = this.generateId();

      const wrappedCallback = (frameId, deltaTime, elapsed) => {
        callback(elapsed);
      };

      timeEngine.registerRenderCallback(`raf-${id}`, wrappedCallback);
      return id;
    };

    Globals.cancelAnimationFrame = (id) => {
      timeEngine.unregisterRenderCallback(`raf-${id}`);
      if (originalCAF) originalCAF(id);
    };
  }

  createAnimation(config) {
    const animation = {
      id: this.generateId(),
      config: { ...config },
      isActive: false,
      startTime: 0,
      currentValues: {},
      targetValues: {},
      onUpdate: config.onUpdate || (() => {}),
      onComplete: config.onComplete || (() => {}),
    };

    this.activeAnimations.set(animation.id, animation);
    return this.createAnimationInterface(animation);
  }

  createSpringAnimation(element, config = {}) {
    if (!element) {
      console.warn("Element is required for spring animation");
      return null;
    }

    const animation = this.createAnimation({
      element,
      type: "spring",
      tension: config.tension || 120,
      friction: config.friction || 14,
      mass: config.mass || 1,
      precision: config.precision || 0.01,
      ...config,
    });

    return animation;
  }

  createCSSAnimation(element, properties, config = {}) {
    if (!element || !properties) {
      console.warn("Element and properties are required");
      return null;
    }

    const animation = this.createAnimation({
      element,
      type: "css",
      properties,
      duration: config.duration || 1000,
      easing: config.easing || "ease-out",
      ...config,
    });

    return animation;
  }

  createAnimationInterface(animation) {
    return {
      id: animation.id,

      start: (targetValues) => {
        return this.startAnimation(animation, targetValues);
      },

      stop: () => {
        this.stopAnimation(animation.id);
      },

      pause: () => {
        animation.isActive = false;
      },

      resume: () => {
        animation.isActive = true;
      },

      get: () => {
        return { ...animation.currentValues };
      },

      set: (values) => {
        Object.assign(animation.currentValues, values);
        this.applyValues(animation);
      },

      isActive: () => {
        return animation.isActive;
      },
    };
  }

  startAnimation(animation, targetValues) {
    animation.targetValues = { ...targetValues };
    animation.isActive = true;
    animation.startTime = timeEngine.elapsedTime;

    // Получаем начальные значения
    this.initializeCurrentValues(animation);

    // Регистрируем колбэк для обновления анимации
    const updateCallback = (frameId, deltaTime, elapsed) => {
      if (!animation.isActive) return;

      const progress = this.updateAnimation(animation, deltaTime, elapsed);

      if (progress >= 1) {
        animation.isActive = false;
        timeEngine.unregisterRenderCallback(animation.id);
        animation.onComplete(animation.currentValues);
      }
    };

    timeEngine.registerRenderCallback(animation.id, updateCallback);

    return new Promise((resolve) => {
      const originalComplete = animation.onComplete;
      animation.onComplete = (values) => {
        originalComplete(values);
        resolve(values);
      };
    });
  }

  initializeCurrentValues(animation) {
    const { element, type } = animation.config;

    if (!element) return;

    switch (type) {
      case "css":
        this.initializeCSSValues(animation);
        break;
      case "spring":
        this.initializeSpringValues(animation);
        break;
      default:
        // Пытаемся автоматически определить начальные значения
        this.autoInitializeValues(animation);
    }
  }

  initializeCSSValues(animation) {
    const { element, properties } = animation.config;
    const computed = getComputedStyle(element);

    for (const prop in properties) {
      if (prop === "transform") {
        animation.currentValues[prop] = this.parseTransform(element);
      } else if (prop === "opacity") {
        animation.currentValues[prop] = parseFloat(computed.opacity) || 1;
      } else {
        animation.currentValues[prop] = parseFloat(computed[prop]) || 0;
      }
    }
  }

  initializeSpringValues(animation) {
    const { element } = animation.config;

    // Для spring анимаций инициализируем базовые transform значения
    animation.currentValues = {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
      ...animation.currentValues,
    };
  }

  autoInitializeValues(animation) {
    // Автоматическая инициализация на основе целевых значений
    for (const key in animation.targetValues) {
      if (!(key in animation.currentValues)) {
        animation.currentValues[key] = 0;
      }
    }
  }

  updateAnimation(animation, deltaTime, elapsed) {
    const { type } = animation.config;

    switch (type) {
      case "css":
        return this.updateCSSAnimation(animation, deltaTime, elapsed);
      case "spring":
        return this.updateSpringAnimation(animation, deltaTime);
      default:
        return this.updateLinearAnimation(animation, deltaTime, elapsed);
    }
  }

  updateCSSAnimation(animation, deltaTime, elapsed) {
    const { duration } = animation.config;
    const timePassed = elapsed - animation.startTime;
    const progress = Math.min(timePassed / duration, 1);

    // Простая линейная интерполяция
    for (const key in animation.targetValues) {
      const start = animation.currentValues[key] || 0;
      const target = animation.targetValues[key];
      animation.currentValues[key] =
        start + (target - start) * this.easeOut(progress);
    }

    this.applyValues(animation);
    return progress;
  }

  updateSpringAnimation(animation, deltaTime) {
    const { tension, friction, mass, precision } = animation.config;
    let hasConverged = true;

    for (const key in animation.targetValues) {
      const current = animation.currentValues[key] || 0;
      const target = animation.targetValues[key];

      // Простая spring физика
      const displacement = target - current;
      const springForce = displacement * tension;
      const dampingForce = -(animation.velocity?.[key] || 0) * friction;
      const acceleration = (springForce + dampingForce) / mass;

      // Обновляем скорость и позицию
      if (!animation.velocity) animation.velocity = {};
      animation.velocity[key] =
        (animation.velocity[key] || 0) + acceleration * (deltaTime / 1000);
      animation.currentValues[key] =
        current + animation.velocity[key] * (deltaTime / 1000);

      // Проверяем сходимость
      if (
        Math.abs(displacement) > precision ||
        Math.abs(animation.velocity[key]) > precision
      ) {
        hasConverged = false;
      }
    }

    this.applyValues(animation);
    return hasConverged ? 1 : 0;
  }

  updateLinearAnimation(animation, deltaTime, elapsed) {
    const duration = animation.config.duration || 1000;
    const timePassed = elapsed - animation.startTime;
    const progress = Math.min(timePassed / duration, 1);

    for (const key in animation.targetValues) {
      const start = animation.currentValues[key] || 0;
      const target = animation.targetValues[key];
      animation.currentValues[key] = start + (target - start) * progress;
    }

    this.applyValues(animation);
    return progress;
  }

  applyValues(animation) {
    const { element } = animation.config;
    if (!element) return;

    const values = animation.currentValues;

    // Применяем CSS трансформации
    if (
      "x" in values ||
      "y" in values ||
      "scale" in values ||
      "rotation" in values
    ) {
      const transforms = [];

      if ("x" in values || "y" in values) {
        transforms.push(`translate(${values.x || 0}px, ${values.y || 0}px)`);
      }
      if ("scale" in values) {
        transforms.push(`scale(${values.scale || 1})`);
      }
      if ("rotation" in values) {
        transforms.push(`rotate(${values.rotation || 0}deg)`);
      }

      element.style.transform = transforms.join(" ");
    }

    // Применяем другие CSS свойства
    if ("opacity" in values) {
      element.style.opacity = values.opacity;
    }

    // Вызываем пользовательский колбэк
    animation.onUpdate(values);
  }

  stopAnimation(id) {
    const animation = this.activeAnimations.get(id);
    if (animation) {
      animation.isActive = false;
      timeEngine.unregisterRenderCallback(id);
      this.activeAnimations.delete(id);
    }
  }

  stopAllAnimations() {
    for (const [id] of this.activeAnimations) {
      this.stopAnimation(id);
    }
  }

  parseTransform(element) {
    const transform = getComputedStyle(element).transform;
    // Простой парсер transform matrix
    return { x: 0, y: 0, scale: 1, rotation: 0 };
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  generateId() {
    return `anim-${++this.animationId}`;
  }

  // Утилиты для React
  createReactHook() {
    return (element, config = {}) => {
      const animationRef = useRef(null);

      const start = useCallback(
        (target) => {
          if (animationRef.current) {
            animationRef.current.stop();
          }

          if (element) {
            animationRef.current = this.createSpringAnimation(element, config);
            return animationRef.current.start(target);
          }
        },
        [element, config],
      );

      const stop = useCallback(() => {
        if (animationRef.current) {
          animationRef.current.stop();
          animationRef.current = null;
        }
      }, []);

      useEffect(() => {
        return () => stop();
      }, [stop]);

      return { start, stop, animation: animationRef.current };
    };
  }

  // Метрики производительности
  getMetrics() {
    return {
      activeAnimations: this.activeAnimations.size,
      fps: timeEngine.fps,
      timeScale: timeEngine.timeScale,
      isRunning: timeEngine.isRunning,
    };
  }
}

// Создаем единственный экземпляр
export const baseAnimationSystem = new BaseAnimationSystem();

// Удобные функции для экспорта
export const createAnimation = (config) =>
  baseAnimationSystem.createAnimation(config);
export const createSpringAnimation = (element, config) =>
  baseAnimationSystem.createSpringAnimation(element, config);
export const createCSSAnimation = (element, properties, config) =>
  baseAnimationSystem.createCSSAnimation(element, properties, config);

// React хуки
import { useRef, useCallback, useEffect } from "react";

export const useAnimation = (config = {}) => {
  const animationRef = useRef(null);

  const start = useCallback(
    (element, target) => {
      if (animationRef.current) {
        animationRef.current.stop();
      }

      if (element) {
        animationRef.current = baseAnimationSystem.createSpringAnimation(
          element,
          config,
        );
        return animationRef.current.start(target);
      }
    },
    [config],
  );

  const stop = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { start, stop, animation: animationRef.current };
};

export const useSpringAnimation = (element, config = {}) => {
  const animationRef = useRef(null);

  useEffect(() => {
    if (element) {
      animationRef.current = baseAnimationSystem.createSpringAnimation(
        element,
        config,
      );
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [element, config]);

  return animationRef.current;
};
