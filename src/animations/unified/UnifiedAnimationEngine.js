/* ----------------------------------------------------------------
 * UnifiedAnimationEngine.js
 * Совмещённый движок:
 *  – адаптивные пресеты + «умные» Spring/Controller (ModernAnimationEngine)
 *  – метрики, упрощение конфигов и device-detect (AnimationCore)
 *  – глубокая интеграция c RafzCoordinator + throttle/setTimeout/sync
 * -------------------------------------------------------------- */
import { motionValue } from "motion/react";
import { SpringValue, Controller, Globals } from "@react-spring/web";
import { makeAutoObservable, reaction, runInAction, computed } from "mobx";
import { raf, rafzCoordinator } from "@animations/unified/RafzCoordinator";
import { gradientStore } from "@stores/gradient";
import { uiStore } from "@stores/ui";

/* ---------- 1. Адаптивные пресеты и конфиг-менеджер ---------- */

const PRESETS = {
  gentle: { tension: 120, friction: 14, mass: 1 },
  snappy: { tension: 400, friction: 25, mass: 0.8 },
  page: { tension: 280, friction: 30, mass: 1.2 },
  theme: { tension: 150, friction: 18, mass: 1.5 },
  reduced: { duration: 200, easing: "linear" },
};

const AdaptiveConfig = () => {
  const device = {
    isMobile: false,

    // /Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
    isLowEnd: false,
    // (navigator.hardwareConcurrency || 8) <= 4 ||
    // window.devicePixelRatio < 1.5,
    prefersReducedMotion: false,
    // matchMedia("(prefers-reduced-motion: reduce)")
    //   .matches
  };
  const user = { intensity: 1 };
  //
  // get(preset = "gentle", extra = {})
  // {
  //     if (this.device.prefersReducedMotion) return PRESETS.reduced;
  //
  //     let cfg = {...(PRESETS[preset] ?? PRESETS.gentle)};
  //
  //     if (this.device.isLowEnd) cfg = {...cfg, clamp: true, precision: 0.01};
  //     if (this.device.isMobile) cfg.friction *= 1.2;
  //
  //     if (this.user.intensity < 1) {
  //         cfg = {
  //             ...cfg,
  //             tension: cfg.tension * this.user.intensity,
  //             friction: cfg.friction * (2 - this.user.intensity),
  //         };
  //     }
  //     return {...cfg, ...extra};

  return {
    device,
    user,
  }; // можно переопределять из настроек
};

/* ---------- 2. Движок ---------- */

class UnifiedAnimationEngine {
  springs = new Map(); // Map<string, SmartSpring>
  controllers = {}; // Map<string, SmartController>
  active = new Set(); // текущие анимации
  metrics = { total: 0, jank: 0, lastDt: 0, avgDt: 0 };
  motionElapsedTime = motionValue(0);

  constructor() {
    makeAutoObservable(this, {
      pageValues: computed,
      themeValues: computed,
      navigationValues: computed,
      metrics: false,
    });

    // this.config = AdaptiveConfig();

    /* --- 2.1 Глобальная оптимизация через Globals + rafz --- */
    Globals.assign({
      frameLoop: "manual", // управляем сами
      // skipAnimation: this.config.device.prefersReducedMotion,
      skipAnimation: false,
      defaultResetProp: true,
      requestAnimationFrame: (cb) =>
        raf(() => {
          cb(raf.now());
          return false;
        }),
    });
    raf.frameLoop = "demand"; // кадр по требованию

    /* --- 2.2 Метрики кадра (через RafzCoordinator) --- */
    rafzCoordinator.onStart("uae-metrics-start", (_, dt) =>
      this.beforeFrame(dt),
    );
    rafzCoordinator.onFinish("uae-metrics-finish", (_, dt) =>
      this.afterFrame(dt),
    );

    /* --- 2.3 Базовые контроллеры --- */
    this.createDefaults();

    /* --- 2.4 Реакции MobX --- */
    this.setupReactions();
  }

  /* ---------- 2.3 Smart Spring / Smart Controller  ---------- */

  @computed get pageValues() {
    return this.page.getValues();
  }

  @computed get themeValues() {
    return this.theme.springs;
  }

  /* ---------- 2.4 Дефолтные анимации ---------- */

  @computed get navigationValues() {
    return this.navigation.getValues();
  }

  /* ---------- 2.5 MobX реакции ---------- */

  createSmartSpring(name, initial, preset = "gentle", opts = {}) {
    const spring = new SpringValue(initial);
    spring.options.config = this.config.get(preset, opts.config);

    const api = {
      spring,
      to: (v, c) => {
        this.active.add(name);
        return spring
          .start({
            to: v,
            config: c ?? spring.options.config,
            onRest: opts.onComplete,
          })
          .finally(() => this.active.delete(name));
      },
      get: () => spring.get(),
      pause: () => spring.pause(),
      resume: () => spring.resume(),
      stop: () => spring.stop(),
      setConfig: (preset, add) => {
        spring.options.config = this.config.get(preset, add);
      },
      dispose: () => {
        spring.stop();
        this.springs.delete(name);
      },
    };
    this.springs.set(name, api);
    return api;
  }

  /* ---------- 3. Анимации высокого уровня ---------- */

  /* ---------- 4. Метрики / кадр ---------- */

  createDefaults() {
    this.page = this.createSmartController(
      "page",
      { x: 225, y: -50, scale: 1.7, opacity: 1 },
      "page",
    );
    this.theme = this.createSmartController(
      "theme",
      { ...gradientStore.getTheme },
      "theme",
    );
    this.navigation = this.createSmartController(
      "navigation",
      { opacity: 0, x: -50, scale: 0.95 },
      "snappy",
    );
  }

  setupReactions() {
    reaction(
      () => uiStore.isNavbarOpened,
      (isOpen) => this.animateNavbar(isOpen),
      { fireImmediately: true },
    );
    reaction(
      () => gradientStore.getTheme,
      (theme) => this.theme.to(theme),
      { fireImmediately: true },
    );
  }

  /* ---------- 5. Публичные геттеры ---------- */

  async animateNavbar(open) {
    if (open) {
      await this.navigation.to({ opacity: 1, scale: 1 });
      await this.page.to({ x: 250, y: 50, scale: 1 });
    } else {
      await Promise.all([
        this.navigation.to({ opacity: 0, x: -50, scale: 0.95 }),
        this.page.to({ x: 225, y: -50, scale: 1.7 }),
      ]);
    }
  }

  beforeFrame(dt) {
    /* зарезервировано под onStart */
  }

  afterFrame(dt) {
    if (!dt) return;
    runInAction(() => {
      const m = this.metrics;
      m.total++;
      m.lastDt = dt;
      m.avgDt = m.avgDt * 0.95 + dt * 0.05;
      if (dt > 20) m.jank++;
    });
  }

  /* ---------- 6. Хелперы напрямую от RafzCoordinator ---------- */

  throttle = (fn) => rafzCoordinator.throttle(fn);
  setTimeout = (cb, ms) => rafzCoordinator.setTimeout(cb, ms);
  sync = (fn) => rafzCoordinator.sync(fn);
  onFrame = (id, cb) => rafzCoordinator.register(id, cb, "frame");

  /* ---------- 7. Управление / очистка ---------- */

  pauseAll() {
    [...this.springs.values(), ...this.controllers.values()].forEach((a) =>
      a.pause?.(),
    );
  }

  resumeAll() {
    [...this.springs.values(), ...this.controllers.values()].forEach((a) =>
      a.resume?.(),
    );
  }

  dispose() {
    [...this.springs.values(), ...this.controllers.values()].forEach((a) =>
      a.dispose?.(),
    );
    this.springs.clear();
    this.controllers.clear();
    this.active.clear();
  }
}

/* ---------- 8. Экспорт единственного экземпляра ---------- */
export const unifiedAnimationEngine = new UnifiedAnimationEngine();
