// Enhanced Animation Engine with modern patterns
import { SpringValue, Controller, Globals } from "@react-spring/web";
import { makeAutoObservable, reaction, computed } from "mobx";
import params from "./configs/pageWithNavBarMoving.json";
// import params from "./configs/navBarMoving.json";

// Декларативные конфигурации анимаций
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

// Система адаптивных конфигураций
class AdaptiveConfigManager {
  constructor() {
    this.deviceCapabilities = this.detectDevice();
    this.userPreferences = this.getUserPreferences();
  }

  detectDevice() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isLowEnd =
      navigator.hardwareConcurrency <= 4 || window.devicePixelRatio < 1.5;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    return { isMobile, isLowEnd, prefersReducedMotion };
  }

  getUserPreferences() {
    // Можно сохранять в localStorage или получать из настроек пользователя
    return {
      animationIntensity: 1, // 0-1
      preferPerformance: false,
      enableMicroAnimations: true,
    };
  }

  getConfig(preset, context = {}) {
    let config = ANIMATION_PRESETS[preset] || ANIMATION_PRESETS.gentle;

    // Адаптируем под устройство
    if (this.deviceCapabilities.prefersReducedMotion) {
      return ANIMATION_PRESETS.reduced;
    }

    if (this.deviceCapabilities.isLowEnd) {
      config = { ...config, clamp: true, precision: 0.01 };
    }

    if (this.deviceCapabilities.isMobile) {
      config = { ...config, friction: config.friction * 1.2 }; // Немного медленнее на мобильных
    }

    // Применяем пользовательские настройки
    if (this.userPreferences.animationIntensity < 1) {
      config = {
        ...config,
        tension: config.tension * this.userPreferences.animationIntensity,
        friction:
          config.friction * (2 - this.userPreferences.animationIntensity),
      };
    }

    return { ...config, ...context };
  }
}

// Система композиции анимаций
class AnimationComposer {
  constructor() {
    this.sequences = new Map();
    this.groups = new Map();
  }

  // Создание последовательности анимаций
  createSequence(name, steps) {
    const sequence = {
      steps,
      play: async (target) => {
        for (const step of steps) {
          if (step.parallel) {
            await Promise.all(
              step.animations.map((anim) => this.executeStep(anim, target)),
            );
          } else {
            await this.executeStep(step, target);
          }

          if (step.delay) {
            await new Promise((resolve) => setTimeout(resolve, step.delay));
          }
        }
      },
    };

    this.sequences.set(name, sequence);
    return sequence;
  }

  // Создание группы синхронизированных анимаций
  createGroup(name, animations) {
    const group = {
      animations,
      play: () => Promise.all(animations.map((anim) => anim.start())),
      pause: () => animations.forEach((anim) => anim.pause()),
      resume: () => animations.forEach((anim) => anim.resume()),
      stop: () => animations.forEach((anim) => anim.stop()),
    };

    this.groups.set(name, group);
    return group;
  }

  executeStep(step, target) {
    return target.start(step.to, step.config);
  }
}

// Основной движок анимаций с современными паттернами
class ModernAnimationEngine {
  constructor() {
    makeAutoObservable(this, {
      springs: false,
      controllers: false,
      configManager: false,
      composer: false,
    });

    this.configManager = new AdaptiveConfigManager();
    this.composer = new AnimationComposer();
    this.springs = new Map();
    this.controllers = new Map();
    this.activeAnimations = new Set();

    this.setupGlobalOptimizations();
    this.createDefaultAnimations();
    this.setupReactions();
  }

  // Методы для компонентов
  @computed get pageValues() {
    return this.page.getValues();
  }

  @computed get themeValues() {
    return this.theme.springs;
  }

  @computed get navigationValues() {
    return this.navigation.getValues();
  }

  setupGlobalOptimizations() {
    // Оптимизация производительности
    Globals.assign({
      skipAnimation: this.configManager.deviceCapabilities.prefersReducedMotion,
      frameLoop: this.configManager.deviceCapabilities.isLowEnd
        ? "demand"
        : "always",
      defaultResetProp: true,
      // Кастомный RAF для интеграции с timerStore
      requestAnimationFrame: (cb) => {
        if (window.timerStore) {
          return window.timerStore.register(`animation-${Date.now()}`, cb);
        }
        return requestAnimationFrame(cb);
      },
    });
  }

  // Фабрика для создания умных анимаций
  createSmartSpring(name, initialValue, preset = "gentle", options = {}) {
    const config = this.configManager.getConfig(preset, options.config);
    const spring = new SpringValue(initialValue);

    spring.options.config = config;

    // Добавляем метаданные
    spring._meta = {
      name,
      preset,
      created: Date.now(),
      lastUsed: Date.now(),
    };

    // Обертка с дополнительными возможностями
    const smartSpring = {
      spring,
      name,

      // Методы управления
      to: (value, customConfig) => {
        spring._meta.lastUsed = Date.now();
        this.activeAnimations.add(name);

        return spring.start({
          to: value,
          config: customConfig || spring.options.config,
          onRest: () => {
            this.activeAnimations.delete(name);
            options.onComplete?.();
          },
        });
      },

      // Безопасные методы получения значений
      get: () => spring.get(),
      getValue: () => spring.animation.to,

      // Управление жизненным циклом
      pause: () => spring.pause(),
      resume: () => spring.resume(),
      stop: () => {
        spring.stop();
        this.activeAnimations.delete(name);
      },

      // Изменение конфигурации на лету
      setConfig: (newPreset, customConfig) => {
        spring.options.config = this.configManager.getConfig(
          newPreset,
          customConfig,
        );
      },

      // Очистка ресурсов
      dispose: () => {
        spring.stop();
        this.springs.delete(name);
        this.activeAnimations.delete(name);
      },
    };

    this.springs.set(name, smartSpring);
    return smartSpring;
  }

  // Создание контроллера с улучшенным API
  createSmartController(name, initialValues, preset = "gentle", options = {}) {
    const config = this.configManager.getConfig(preset, options.config);
    const controller = new Controller({
      ...initialValues,
      config,
      ...options,
    });

    const smartController = {
      controller,
      name,

      // Удобные методы
      to: (values, customConfig) => {
        this.activeAnimations.add(name);
        return controller.start({
          to: values,
          config: customConfig || config,
          onRest: () => {
            this.activeAnimations.delete(name);
            options.onComplete?.();
          },
        });
      },

      // Получение значений
      get springs() {
        return controller.springs;
      },
      getValues: () => controller.get(),

      // Расширенные методы анимации
      sequence: async (steps) => {
        for (const step of steps) {
          await controller.start(step);
          if (step.delay) {
            await new Promise((resolve) => setTimeout(resolve, step.delay));
          }
        }
      },

      // Управление
      pause: () => controller.pause(),
      resume: () => controller.resume(),
      stop: () => {
        controller.stop();
        this.activeAnimations.delete(name);
      },

      dispose: () => {
        controller.stop();
        this.controllers.delete(name);
        this.activeAnimations.delete(name);
      },
    };

    this.controllers.set(name, smartController);
    return smartController;
  }

  createDefaultAnimations() {
    // Анимации страницы
    this.page = this.createSmartController(
      "page",
      {
        x: 225,
        y: -50,
        scale: 1.7,
        opacity: 1,
      },
      "page",
    );

    // Анимации темы
    this.theme = this.createSmartController(
      "theme",
      {
        background: "#ffffff",
        textColor: "#000000",
        highlightColor: "#0066cc",
        borderRadius: 4,
      },
      "theme",
    );

    // Анимации навигации
    this.navigation = this.createSmartController(
      "navigation",
      {
        opacity: 0,
        x: -50,
        scale: 0.95,
      },
      "snappy",
    );
  }

  setupReactions() {
    // Реакция на состояние навбара
    reaction(
      () => window.uiStore?.isNavbarOpened,
      (isOpened) => this.animateNavbarState(isOpened),
      { fireImmediately: true },
    );

    // Реакция на смену темы
    reaction(
      () => window.uiStore?.theme,
      (theme) => this.animateThemeChange(theme),
      { fireImmediately: true },
    );
  }

  async animateThemeChange(theme) {
    const themeValues = this.getThemeValues(theme);

    // Каскадная анимация смены темы
    await this.theme.sequence([
      { background: themeValues.background, delay: 0 },
      {
        textColor: themeValues.textColor,
        highlightColor: themeValues.highlightColor,
        delay: 50,
      },
      { borderRadius: themeValues.borderRadius, delay: 100 },
    ]);
  }

  getThemeValues(theme) {
    return theme === "dark"
      ? {
          background: "#222222",
          textColor: "#ffffff",
          highlightColor: "#66ccff",
          borderRadius: 8,
        }
      : {
          background: "#ffffff",
          textColor: "#000000",
          highlightColor: "#0066cc",
          borderRadius: 4,
        };
  }

  // Управление производительностью
  pauseAll() {
    [...this.springs.values(), ...this.controllers.values()].forEach((anim) =>
      anim.pause(),
    );
  }

  resumeAll() {
    [...this.springs.values(), ...this.controllers.values()].forEach((anim) =>
      anim.resume(),
    );
  }

  // Диагностика и отладка
  getPerformanceMetrics() {
    return {
      activeAnimations: this.activeAnimations.size,
      totalSprings: this.springs.size,
      totalControllers: this.controllers.size,
      deviceInfo: this.configManager.deviceCapabilities,
      userPreferences: this.configManager.userPreferences,
    };
  }

  // Очистка ресурсов
  dispose() {
    [...this.springs.values(), ...this.controllers.values()].forEach((anim) =>
      anim.dispose(),
    );
    this.springs.clear();
    this.controllers.clear();
    this.activeAnimations.clear();
  }
}

export const modernAnimationEngine = new ModernAnimationEngine();
