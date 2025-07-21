// ===== Улучшенный Unifiedcore =====
import { makeAutoObservable, runInAction, reaction } from "mobx";
import {
  SpringValue,
  Controller,
  Globals,
  animated,
  useInView,
} from "@react-spring/web";
import { raf } from "@react-spring/rafz";
import chroma from "chroma-js";
import seedrandom from "seedrandom";
import { useEffect, useRef, useState } from "react";
import { ANIMATION_PRESETS } from "./animationPresets";
import { logger } from "./logger.js";

// ===== 1. Конфигурации и пресеты =====

const clamp = (v, mi = 0, ma = 1) => Math.min(ma, Math.max(mi, v));
const modHue = (h) => ((h % 360) + 360) % 360;
const lerp = (a, b, t) => a + (b - a) * t;

// ===== 2. Адаптивная система конфигураций =====
class AdaptiveConfigManager {
  constructor() {
    this.deviceCapabilities = this.detectDevice();
    this.userPreferences = this.getUserPreferences();
    this.performanceProfile = this.createPerformanceProfile(true);
  }

  detectDevice() {
    const isLowEnd = false;
    // navigator.hardwareConcurrency <= 4 || window.devicePixelRatio < 1.5;
    const prefersReducedMotion = false;
    // window.matchMedia(
    //   "(prefers-reduced-motion: reduce)",
    // ).matches;
    const hasGPU = this.detectGPUCapability();
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    return { isLowEnd, prefersReducedMotion, hasGPU, isMobile };
  }

  detectGPUCapability() {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      return !!gl;
    } catch {
      return false;
    }
  }

  getUserPreferences() {
    try {
      return JSON.parse(localStorage.getItem("animationPreferences") || "{}");
    } catch {
      return {};
    }
  }

  createPerformanceProfile(ultraProfile = false) {
    const { isLowEnd, hasGPU } = this.deviceCapabilities;

    if (ultraProfile) return "ultra";
    if (hasGPU) return "performance";
    if (isLowEnd) return "minimal";
    if (!hasGPU) return "balanced";
    return "standard";
  }

  getConfig(preset, context = {}) {
    let config = ANIMATION_PRESETS[preset] || ANIMATION_PRESETS.gentle;

    if (this.deviceCapabilities.prefersReducedMotion) {
      return ANIMATION_PRESETS.reduced;
    }

    // Адаптация под профиль производительности
    switch (this.performanceProfile) {
      case "minimal":
        config = {
          ...config,
          clamp: true,
          precision: 0.01,
          mass: config.mass * 1.5,
        };
        break;
      case "balanced":
        config = { ...config, precision: 0.005 };
        break;
      case "performance":
        config = { ...config, precision: 0.001 };
      case "ultra":
        config = { ...config, precision: 0.0001 };
        break;
    }

    const userIntensity = this.userPreferences.animationIntensity ?? 1;
    if (userIntensity < 1) {
      config = {
        ...config,
        tension: config.tension * userIntensity,
        friction: config.friction * (2 - userIntensity),
      };
    }

    return { ...config, ...context };
  }
}

// ===== 3. Улучшенная система градиентов =====
class AdvancedGradientSystem {
  constructor(core, type, config) {
    this.core = core;
    this.type = type;
    this.config = {
      saturation: 0.8,
      lightness: 0.5,
      segments: 16,
      startHue: 0,
      endHue: 360,
      dark: false,
      seed: null,
      animationMode: "rotate",
      speed: 33,
      ...config,
    };

    this.values = this.calculateInitialValues();
    this.animationId = null;
    this.timeOffset = Math.random() * 1000;

    makeAutoObservable(this);
  }

  calculateInitialValues() {
    const { saturation, lightness, segments, startHue, endHue, dark, seed } =
      this.config;

    const seg = Math.max(2, segments);
    const step = 1 / (seg - 1);
    const L = clamp(dark ? lightness * 0.6 : lightness);
    const C = clamp(saturation);
    const rng = seed ? seedrandom(seed) : Math.random;

    return Array.from({ length: seg }, (_, i) => {
      const t = i * step;
      const baseHue = startHue + t * (endHue - startHue);
      const hue = modHue(baseHue + rng() * 20 - 10); // Добавляем вариативность
      return chroma.oklch(L, C, hue).hex();
    });
  }

  calculateCurrentValues(elapsedTime) {
    const { animationMode, speed, segments } = this.config;
    const time = (elapsedTime + this.timeOffset) * 0.001 * speed;

    switch (animationMode) {
      case "rotate":
        return this.values.map((color, i) => {
          const hue = chroma(color).get("hsl.h");
          const newHue = modHue(hue + time * 30);
          return chroma(color).set("hsl.h", newHue).hex();
        });

      case "wave":
        return this.values.map((color, i) => {
          const wave = Math.sin(time + i * 0.5);
          const saturation = this.config.saturation + wave * 0.2;
          return chroma(color).set("hsl.s", clamp(saturation)).hex();
        });

      case "pulse":
        const pulse = (Math.sin(time) + 1) * 0.5;
        return this.values.map((color) => {
          const lightness = this.config.lightness + pulse * 0.2;
          return chroma(color).set("hsl.l", clamp(lightness)).hex();
        });

      default:
        return this.values;
    }
  }

  animate(mode = "rotate", speed = 33) {
    this.stopAnimation();
    this.config.animationMode = mode;
    this.config.speed = speed;
    this.animationId = `gradient-${this.type}-${Math.random().toString(36).slice(2)}`;

    this.core.addCallback(
      this.animationId,
      (frameId, deltaTime, elapsedTime) => {
        this.updateGradient(elapsedTime);
      },
      "background",
    );
  }

  updateGradient(elapsedTime) {
    runInAction(() => {
      this.values = this.calculateCurrentValues(elapsedTime);
    });
  }

  stopAnimation() {
    if (this.animationId) {
      this.core.removeCallback(this.animationId);
      this.animationId = null;
    }
  }

  // Новые методы применения
  toCSSGradient(angle = 45, type = "linear") {
    const colors = this.values.join(", ");
    if (type === "radial") {
      return `radial-gradient(circle, ${colors})`;
    }
    return `linear-gradient(${angle}deg, ${colors})`;
  }

  applyToElement(element, options = {}) {
    if (!element) return;

    const { angle = 45, type = "linear", opacity = 1 } = options;
    const gradient = this.toCSSGradient(angle, type);

    if (opacity < 1) {
      element.style.background = `linear-gradient(rgba(255,255,255,${1 - opacity}), rgba(255,255,255,${1 - opacity})), ${gradient}`;
    } else {
      element.style.background = gradient;
    }
  }
}

// ===== 4. Основной движок анимаций =====
class Core {
  constructor() {
    makeAutoObservable(this, {
      springs: false,
      controllers: false,
      configManager: false,
      _callbacks: false,
      _priorityQueues: false,
      _callbacksByPhase: false,
    });

    // Состояние
    this.elapsedTime = 0;
    this.realElapsedTime = 0;
    this.fps = 0;
    this.frameId = 0;
    this.isRunning = false;
    this.timeScale = 1.0;
    this.detailLevel = 2;
    this.userLockedDetail = false;

    // Системы
    this.configManager = new AdaptiveConfigManager();
    this.springs = new Map();
    this.controllers = new Map();
    this.activeAnimations = new Set();
    this.visibilityStates = new Map();

    // Внутренние структуры
    // this._callbacks = new Map();
    // this._priorityQueues = {
    //     critical: new Set(),
    //     high: new Set(),
    //     normal: new Set(),
    //     background: new Set()
    // };
    // this._phases = {
    //     read: new Set(),
    //     update: new Set(),
    //     write: new Set(),
    //     finish: new Set()
    // };

    this._callbacksByPhase = {
      read: new Map(), // Чтение из DOM
      update: new Map(), // Обновление состояния, расчеты (включая ваши старые приоритеты)
      write: new Map(), // Запись в DOM
      finish: new Map(), // Задачи после завершения кадра
    };
    // Старые _priorityQueues можно интегрировать в 'update' фазу, если нужно
    // или упростить, если фаз достаточно.
    // Для примера, я пока уберу _priorityQueues и _phases,
    // так как rafz сам предоставляет фазы.

    this._frameTimes = [];
    this._fpsCounter = 0;
    this._fpsLastCheck = 0;
    this._lastTime = 0;
    this._optimizerState = {
      lastCheck: 0,
      lastChange: 0,
      fpsTrend: [],
    };

    this._currentScaledDt = 0; // Для передачи в коллбэки фаз

    this.setupGlobalOptimizations();
    // this.setupRAFWithPhases(); // <--- ИЗМЕНЕНО НА НОВЫЙ МЕТОД
    this.setupRAF(); // <--- ИЗМЕНЕНО НА НОВЫЙ МЕТОД
    this.createCoreAnimations();
    this.setupReactions();
  }

  registerInViewCallback(id, callback) {
    this.addCallback(
      `inview-${id}`,
      (frameId, deltaTime) => {
        if (this.visibilityStates.get(id)) {
          callback(deltaTime);
        }
      },
      "background",
    );
  }

  getAnimationPreset = (preset) => this.configManager.getConfig(preset);

  setupGlobalOptimizations() {
    Globals.assign({
      skipAnimation: this.configManager.deviceCapabilities.prefersReducedMotion,
      frameLoop: this.configManager.deviceCapabilities.isLowEnd
        ? "demand"
        : "always",
    });
  }

  setupRAF() {
    const tick = (now) => {
      if (!this.isRunning) return;

      const realDt = Math.min(now - this._lastTime, 1000 / 15);
      this._lastTime = now;
      this.realElapsedTime += realDt;

      const scaledDt = realDt * this.timeScale;

      runInAction(() => {
        this.elapsedTime += scaledDt;
        this.frameId++;
      });

      // Простая обработка всех коллбэков
      this._callbacksByPhase.update.forEach((cbData, id) => {
        if (cbData && cbData._active) {
          try {
            cbData.original(this.frameId, scaledDt, this.elapsedTime);
          } catch (err) {
            console.error(`Callback error [${id}]:`, err);
          }
        }
      });

      this.updateFPS(now);
      this.updatePerformanceStats(realDt);

      if (this.elapsedTime - this._optimizerState.lastCheck > 5000) {
        this.evaluatePerformance();
      }

      requestAnimationFrame(tick);
    };

    this._tick = tick;
  }

  setupRAFWithPhases() {
    // Коллбэки для каждой фазы rafz
    raf.onStart(() => {
      // Фаза 'read'
      this._processPhaseCallbacks("read", this._currentScaledDt);
    });

    raf.onFrame(() => {
      // Фаза 'update' (основные расчеты)
      // вызываем коллбэки, зарегистрированные для 'update'.
      this._processPhaseCallbacks("update", this._currentScaledDt);
    });

    raf.write(() => {
      // Фаза 'write' (запись в DOM)
      this._processPhaseCallbacks("write", this._currentScaledDt);
    });

    raf.onFinish(() => {
      // Фаза 'finish' (после всех операций кадра)
      this._processPhaseCallbacks("finish", this._currentScaledDt);
    });

    const tick = (now) => {
      if (!this.isRunning) return;

      const realDt = Math.min(now - this._lastTime, 1000 / 15); // Ограничение дельты времени
      this._lastTime = now;
      this.realElapsedTime += realDt;

      const scaledDt = realDt * this.timeScale;
      this._currentScaledDt = scaledDt; // Сохраняем для использования в фазовых коллбэках

      runInAction(() => {
        this.elapsedTime += scaledDt;
        this.frameId++;
      });

      this.updateFPS(now);
      this.updatePerformanceStats(realDt);

      if (this.elapsedTime - this._optimizerState.lastCheck > 5000) {
        this.evaluatePerformance();
      }
      if (Globals.frameLoop === "demand") {
        raf.advance(scaledDt);
      }
      requestAnimationFrame(tick);
    };

    this._tick = tick;
  }

  createCoreAnimations() {
    // Анимации страницы
    this.page = this.createController(
      "page",
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
      },
      "page",
    );
  }

  setupReactions() {
    // Реакция на изменение темы
    // if (window.uiStore) {
    //   reaction(
    //     () => window.uiStore.theme,
    //     (theme) => this.animateThemeChange(theme),
    //     { fireImmediately: true },
    //   );
    // }
    // this.start();
  }

  async animateThemeChange(theme) {
    const themeValues =
      theme === "dark"
        ? {
            background: "#1a1a1a",
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

    await this.theme.to(themeValues);
  }

  // ===== Управление временем =====
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this._lastTime = performance.now();
    this._fpsLastCheck = this._lastTime;
    requestAnimationFrame(this._tick);
  }

  stop() {
    this.isRunning = false;
  }

  setTimeScale(scale) {
    this.timeScale = Math.max(0, scale);
  }

  cancelAnimation(id) {
    this.springs.get(id)?.stop();
    this.controllers.get(id)?.stop();
    this.removeCallback(id);
  }

  // ===== Система приоритетов =====
  addCallback(id, callback, priority = "normal") {
    // Все коллбэки идут в update фазу
    this._callbacksByPhase.update.set(id, {
      original: callback,
      _active: true,
    });

    if (!this.isRunning) this.start();
    return () => this.removeCallback(id);
  }

  removeCallback(id) {
    this._callbacksByPhase.update.delete(id);
    // Также проверяем другие фазы на всякий случай
    Object.values(this._callbacksByPhase).forEach((phase) => {
      phase.delete(id);
    });
  }

  // addCallback(id, callback, phase = "update") {
  //   // phase: 'read', 'update', 'write', 'finish'
  //   if (!this._callbacksByPhase[phase]) {
  //     console.warn(`Unknown phase "${phase}". Defaulting to "update".`);
  //     phase = "update";
  //   }
  //   // Сохраняем коллбэк с его состоянием активности
  //   this._callbacksByPhase[phase].set(id, {
  //     original: callback,
  //     _active: true,
  //   });
  //
  //   // if (!this.isRunning) this.start();
  //   return () => this.removeCallback(id, phase);
  // }

  // addCallback(id, callback, priority = 'normal') {
  //     this._callbacks.set(id, callback);
  //     this._priorityQueues[priority].add(id);
  //     if (!this.isRunning) this.start();
  //     return () => this.removeCallback(id);
  // }

  // removeCallback(id, phase = null) {
  //   if (phase && this._callbacksByPhase[phase]) {
  //     this._callbacksByPhase[phase].delete(id);
  //   } else {
  //     // Если фаза не указана, ищем по всем фазам
  //     for (const phaseName in this._callbacksByPhase) {
  //       if (this._callbacksByPhase[phaseName].has(id)) {
  //         this._callbacksByPhase[phaseName].delete(id);
  //         break;
  //       }
  //     }
  //   }
  // }

  _processPhaseCallbacks(phaseName, dt) {
    if (!this._callbacksByPhase[phaseName]) return;

    const callbacksToProcess = Array.from(
      this._callbacksByPhase[phaseName].entries(),
    );
    for (const [id, cbData] of callbacksToProcess) {
      if (cbData && cbData._active === true) {
        try {
          // Передаем frameId, dt (scaledDt), elapsedTime
          cbData.original(this.frameId, dt, this.elapsedTime);
        } catch (err) {
          console.error(`Callback error [${id}] in phase "${phaseName}":`, err);
          // Можно добавить логику для автоматического удаления "сломанных" коллбэков
          // this.removeCallback(id, phaseName);
        }
      }
    }
  }

  // ===== Фабрика контроллеров =====
  createController(
    name,
    initialValues,
    options = { config: this.configManager.getConfig("gentle") },
  ) {
    const controller = new Controller({
      ...initialValues,
      ...options,
    });

    // this.controllers.set(name, api);

    const api = {
      controller,
      name,
      springs: controller.springs,

      to: (values, customConfig) => {
        logger.info(
          "start from",
          JSON.stringify(controller.springs.background),
        );
        logger.info("start to", JSON.stringify(values.background));
        // this.activeAnimations.add(name);
        return controller.start({
          ...values,
          config: customConfig || options.config,
          onRest: () => {
            this.activeAnimations.delete(name);
            options.onComplete?.();
          },
        });
      },

      start: (values, customConfig) => {
        this.activeAnimations.add(name);
        return controller.start({
          ...values,
          config: customConfig?.config || options.config,
          onRest: () => {
            this.activeAnimations.delete(name);
            customConfig?.onComplete?.() || options.onComplete?.();
          },
        });
      },

      sequence: async (steps) => {
        for (const step of steps) {
          await controller.start(step);
          if (step.delay) {
            await new Promise((resolve) => setTimeout(resolve, step.delay));
          }
        }
      },

      parallel: async (animations) => {
        return Promise.all(animations.map((anim) => controller.start(anim)));
      },

      set: (values) => controller.set(values),
      get: () => controller.get(),
      stop: () => controller.stop(),
      pause: () => controller.pause(),
      resume: () => controller.resume(),

      dispose: () => {
        controller.stop();
        this.controllers.delete(name);
        this.activeAnimations.delete(name);
      },
    };
    this.controllers.set(name, api);
    return api;
  }

  // ===== Создание SpringValue =====
  createSpringValue(initialValue, config = {}) {
    const preset = config.preset || "gentle";
    const springConfig = this.configManager.getConfig(preset, config);

    const springValue = new SpringValue(initialValue, springConfig);
    const id = `spring-${Math.random().toString(36).slice(2)}`;

    this.springs.set(id, springValue);

    return {
      id,
      springValue,
      get: () => springValue.get(),
      set: (value) => springValue.start(value),
      start: (value, config) => springValue.start(value, config),
      stop: () => springValue.stop(),
      onChange: (callback) => springValue.start({ onChange: callback }),
      dispose: () => {
        springValue.stop();
        this.springs.delete(id);
      },
    };
  }

  // ===== Градиентные системы =====
  createGradient(type, config = {}) {
    return new AdvancedGradientSystem(this, type, config);
  }

  // ===== Простые анимации элементов =====
  animateElement(element, values, config = {}) {
    if (!element) return null;

    const {
      duration = 1000,
      easing = "ease-out",
      type = "spring",
      preset = "gentle",
    } = config;

    if (type === "css") {
      return this.animateWithCSS(element, values, { duration, easing });
    } else if (type === "spring") {
      return this.animateWithSpring(element, values, { preset, ...config });
    }

    return null;
  }

  animateWithCSS(element, values, { duration, easing }) {
    return new Promise((resolve) => {
      const keyframes = [];
      const properties = Object.keys(values);

      const startValues = {};
      properties.forEach((prop) => {
        const computed = getComputedStyle(element);
        startValues[prop] = computed[prop] || "0";
      });

      keyframes.push(startValues);
      keyframes.push(values);

      const animation = element.animate(keyframes, {
        duration,
        easing,
        fill: "forwards",
      });

      animation.onfinish = () => {
        Object.assign(element.style, values);
        resolve(animation);
      };
    });
  }

  animateWithSpring(element, values, config) {
    const controllerId = `element-${Math.random().toString(36).slice(2)}`;

    // Получаем текущие значения
    const currentValues = {};
    Object.keys(values).forEach((prop) => {
      const computed = getComputedStyle(element);
      currentValues[prop] = parseFloat(computed[prop]) || 0;
    });

    const controller = this.createController(
      controllerId,
      currentValues,
      config.preset,
      config,
    );

    return controller.to(values, {
      ...config,
      onChange: (result) => {
        Object.keys(result.value).forEach((prop) => {
          const value = result.value[prop];
          if (prop === "opacity" || prop === "scale") {
            element.style[prop] = value;
          } else {
            element.style[prop] = `${value}px`;
          }
        });
      },
    });
  }

  // ===== Оптимизация видимости =====
  optimizeVisibility(states) {
    for (const [id, visible] of Object.entries(states)) {
      this.visibilityStates.set(id, visible);
    }

    Object.keys(this._callbacksByPhase).forEach((phaseName) => {
      this._callbacksByPhase[phaseName].forEach((cbData, callbackId) => {
        // Предполагаем, что callbackId может быть связан с id компонента
        const componentId = callbackId.split(":")[0]; // Пример
        const isVisible = this.visibilityStates.get(componentId);
        if (isVisible !== undefined) {
          cbData._active = isVisible;
        }
      });
    });
  }

  // ===== Производительность =====
  updateFPS(now) {
    this._fpsCounter++;

    if (now - this._fpsLastCheck >= 1000) {
      runInAction(() => {
        this.fps = this._fpsCounter;
        this._optimizerState.fpsTrend.push(this.fps);
        if (this._optimizerState.fpsTrend.length > 5) {
          this._optimizerState.fpsTrend.shift();
        }
      });
      this._fpsCounter = 0;
      this._fpsLastCheck = now;
    }
  }

  updatePerformanceStats(dt) {
    this._frameTimes.push(dt);
    if (this._frameTimes.length > 60) this._frameTimes.shift();
  }

  evaluatePerformance() {
    if (this.userLockedDetail) return;

    const avgFps =
      this._optimizerState.fpsTrend.reduce((sum, fps) => sum + fps, 0) /
      this._optimizerState.fpsTrend.length;

    if (avgFps < 40 && this.detailLevel > 0) {
      this.setDetailLevel(this.detailLevel - 1);
    } else if (avgFps > 55 && this.detailLevel < 2) {
      this.setDetailLevel(this.detailLevel + 1);
    }

    this._optimizerState.fpsTrend = [];
    this._optimizerState.lastCheck = this.elapsedTime;
  }

  setDetailLevel(level) {
    this.detailLevel = Math.max(0, Math.min(2, level));
    this._optimizerState.lastChange = this.elapsedTime;
  }

  // ===== Метрики =====
  getMetrics() {
    const avgFrameTime =
      this._frameTimes.length > 0
        ? this._frameTimes.reduce((sum, t) => sum + t, 0) /
          this._frameTimes.length
        : 0;

    return {
      fps: this.fps,
      frameId: this.frameId,
      elapsedTime: this.elapsedTime,
      realElapsedTime: this.realElapsedTime,
      timeScale: this.timeScale,
      detailLevel: this.detailLevel,
      averageFrameTime: avgFrameTime,
      // activeCallbacks: this._callbacks.size,
      // activeControllers: this.controllers.size,
      // activeAnimations: this.activeAnimations.size,
      // activeSprings: this.springs.size,
      isRunning: this.isRunning,
      performanceProfile: this.configManager.performanceProfile,
    };
  }
}

// Безопасный автозапуск
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    core.start();
  });
}
// ===== Единственный экземпляр =====
export const core = new Core();

// ===== 5. React Hooks =====

export const useVisibilityAwareAnimation = (initialValues, options = {}) => {
  const id = useRef(`vis-${Math.random().toString(36).slice(2)}`).current;
  const [controller] = useState(() =>
    core.createController(id, initialValues, options.preset, options),
  );

  useEffect(() => {
    if (options.whileInView) {
      core.registerInViewCallback(id, (deltaTime) => {
        // Выполнять пока элемент виден
        if (typeof options.whileInView === "function") {
          options.whileInView(deltaTime, controller);
        }
      });

      return () => core.removeCallback(id);
    }
  }, [id, controller, options.whileInView]);

  const [ref, inView] = useInView({
    threshold: options.threshold || 0.1,
    root: options.root,
    rootMargin: options.rootMargin,
    once: options.triggerOnce,
    onChange: (inView, entry) => {
      core.optimizeVisibility({ [id]: inView });

      const intersectionRatio = entry.intersectionRatio;
      const direction = entry.isIntersecting ? "enter" : "exit";

      if (options[direction]) {
        // Динамические анимации на основе видимости
        const config =
          typeof options[direction] === "function"
            ? options[direction](entry)
            : options[direction];

        controller.start(config);
      }
    },
  });

  // Автоматическая оптимизация при размонтировании
  useEffect(() => {
    return () => {
      core.optimizeVisibility({ [id]: false });
      controller.dispose();
    };
  }, [controller, id]);

  return { ref, springs: controller.springs, isVisible: inView };
};

export const useSyncedAnimation = (api, options = {}) => {
  useEffect(() => {
    if (!api) return;

    const id = `sync-${Math.random().toString(36).slice(2)}`;

    const callback = (frameId, deltaTime) => {
      if (!options.paused) {
        const speedFactor = options.normalizeSpeed ? deltaTime / 16.67 : 1;
        if (typeof api.update === "function") {
          api.update({ speedFactor });
        }
      }
    };

    const remove = core.addCallback(id, callback, options.priority);
    return remove;
  }, [api, options.priority, options.paused, options.normalizeSpeed]);
};

export const useSpringValue = (initialValue, config = {}) => {
  const [springValue] = useState(() =>
    core.createSpringValue(initialValue, config),
  );

  useEffect(() => {
    return () => springValue.dispose();
  }, [springValue]);

  return springValue;
};

export const useAnimationMetrics = () => {
  const [metrics, setMetrics] = useState(core.getMetrics());

  useEffect(() => {
    const id = `metrics-${Math.random().toString(36).slice(2)}`;
    const dispose = core.addCallback(
      id,
      () => {
        setMetrics(core.getMetrics());
      },
      "background",
    );
    return dispose;
  }, []);
  return metrics;
};

// ===== 6. Экспорт утилит =====
export const OptimizedAnimated = animated;

export const animate = (element, values, config) => {
  return core.animateElement(element, values, config);
};

export const spring = (element, values, config = {}) => {
  return core.animateElement(element, values, {
    type: "spring",
    ...config,
  });
};

export const css = (element, values, config = {}) => {
  return core.animateElement(element, values, {
    type: "css",
    ...config,
  });
};

export const applySVGEffect = (effect) => ({
  style: { filter: `url(#${effect})` },
});

// Простые константы для быстрого доступа
export { clamp, modHue, lerp };
