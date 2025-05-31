// // ===== 1. Corecore.js =====
// // Единый движок без дублирования
// import {makeAutoObservable, runInAction,computed,reaction} from "mobx";
// import { SpringValue, Controller, Globals, animated } from "@react-spring/web";
// import { raf } from "@react-spring/rafz";
// import chroma from "chroma-js";
// import seedrandom from "seedrandom";
//
// // ===== 1. Конфигурации и пресеты =====
// const ANIMATION_PRESETS = {
//     instant: { tension: 1000, friction: 100, mass: 0.1 },
//     snappy: { tension: 400, friction: 25, mass: 0.8 },
//     gentle: { tension: 120, friction: 14, mass: 1 },
//     wobbly: { tension: 180, friction: 12, mass: 1 },
//     stiff: { tension: 210, friction: 20, mass: 1 },
//     micro: { tension: 300, friction: 10, mass: 0.2 },
//     page: { tension: 280, friction: 30, mass: 1.2 },
//     modal: { tension: 250, friction: 22, mass: 1 },
//     theme: { tension: 150, friction: 18, mass: 1.5 },
//     mobile: { tension: 200, friction: 25, mass: 1, clamp: true },
//     desktop: { tension: 350, friction: 28, mass: 0.9 },
//     reduced: { duration: 200, easing: "linear" }
// };
//
// const clamp = (v, mi = 0, ma = 1) => Math.min(ma, Math.max(mi, v));
// const modHue = (h) => ((h % 360) + 360) % 360;
//
// // ===== 2. Адаптивная система конфигураций =====
// class AdaptiveConfigManager {
//     constructor() {
//         this.deviceCapabilities = this.detectDevice();
//         this.userPreferences = this.getUserPreferences();
//     }
//
//     detectDevice() {
//         const isLowEnd = navigator.hardwareConcurrency <= 4 || window.devicePixelRatio < 1.5;
//         const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//         return { isLowEnd, prefersReducedMotion };
//     }
//
//     getUserPreferences() {
//         return JSON.parse(localStorage.getItem('animationPreferences') || {
//             animationIntensity: 1,
//             preferPerformance: false,
//             enableMicroAnimations: true
//         };
//     }
//
//     getConfig(preset, context = {}) {
//         let config = ANIMATION_PRESETS[preset] || ANIMATION_PRESETS.gentle;
//
//         if (this.deviceCapabilities.prefersReducedMotion) {
//             return ANIMATION_PRESETS.reduced;
//         }
//
//         if (this.deviceCapabilities.isLowEnd) {
//             config = { ...config, clamp: true, precision: 0.01 };
//         }
//
//         if (this.userPreferences.animationIntensity < 1) {
//             config = {
//                 ...config,
//                 tension: config.tension * this.userPreferences.animationIntensity,
//                 friction: config.friction * (2 - this.userPreferences.animationIntensity)
//             };
//         }
//
//         return { ...config, ...context };
//     }
// }
//
// // ===== 3. Система градиентов =====
// class GradientSystem {
//     constructor(core, type, config) {
//         this.core = core;
//         this.type = type;
//         this.config = config;
//         this.values = this.calculateInitialValues();
//         this.animationId = null;
//         makeAutoObservable(this);
//     }
//
//     calculateInitialValues() {
//         const { saturation = 0.8, lightness = 0.5, segments = 16,
//             startHue = 0, endHue = 360, dark = false, seed } = this.config;
//
//         const seg = Math.max(2, segments);
//         const step = 1 / (seg - 1);
//         const L = clamp(dark ? lightness * 0.8 : lightness);
//         const C = clamp(saturation);
//         const rng = seed ? seedrandom(seed) : Math.random;
//
//         return Array.from({ length: seg }, (_, i) => {
//             const t = i * step;
//             const hue = modHue(startHue + t * (endHue - startHue) + rng() * 1e-4);
//             return chroma.oklch(L, C, hue).hex();
//         });
//     }
//
//     animate(mode = "rotate", speed = 33) {
//         this.stopAnimation();
//         this.animationId = `gradient-${this.type}-${Math.random().toString(36).slice(2)}`;
//
//         this.core.addCallback(this.animationId, () => {
//             this.updateGradient();
//         }, 'background');
//     }
//
//     updateGradient() {
//         // Логика обновления градиента
//         runInAction(() => {
//             this.values = this.calculateCurrentValues();
//         });
//     }
//
//     stopAnimation() {
//         if (this.animationId) {
//             this.core.removeCallback(this.animationId);
//             this.animationId = null;
//         }
//     }
//
//     applyToElement(element) {
//         if (!element) return;
//         element.style.background = `linear-gradient(45deg, ${this.values.join(', ')})`;
//     }
// }
//
// // ===== 4. Основной движок анимаций =====
// class UnifiedAnimationEngine {
//     constructor() {
//         makeAutoObservable(this, {
//             springs: false,
//             controllers: false,
//             configManager: false,
//             composer: false,
//         });
//
//         this.configManager = new AdaptiveConfigManager();
//         this.springs = new Map();
//         this.controllers = new Map();
//         this.activeAnimations = new Set();
//         this.visibilityStates = new Map();
//
//         this.setupGlobalOptimizations();
//         this.createCoreAnimations();
//         this.setupReactions();
//     }
//
//     setupGlobalOptimizations() {
//         Globals.assign({
//             skipAnimation: this.configManager.deviceCapabilities.prefersReducedMotion,
//             frameLoop: this.configManager.deviceCapabilities.isLowEnd ? "demand" : "always",
//             requestAnimationFrame: (cb) => {
//                 const id = `raf-${Date.now()}`;
//                 this.addCallback(id, () => cb(performance.now()), 'critical');
//                 return () => this.removeCallback(id);
//             }
//         });
//     }
//
//     createCoreAnimations() {
//         // Анимации страницы
//         this.page = this.createController("page", {
//             x: 225,
//             y: -50,
//             scale: 1.7,
//             opacity: 1
//         }, "page");
//
//         // Анимации темы
//         this.theme = this.createController("theme", {
//             background: "#ffffff",
//             textColor: "#000000",
//             highlightColor: "#0066cc",
//             borderRadius: 4
//         }, "theme");
//     }
//
//     setupReactions() {
//         reaction(
//             () => window.uiStore?.theme,
//             (theme) => this.animateThemeChange(theme),
//             { fireImmediately: true }
//         );
//     }
//
//     async animateThemeChange(theme) {
//         const themeValues = theme === "dark"
//             ? { background: "#222222", textColor: "#ffffff", highlightColor: "#66ccff", borderRadius: 8 }
//             : { background: "#ffffff", textColor: "#000000", highlightColor: "#0066cc", borderRadius: 4 };
//
//         await this.theme.start(themeValues);
//     }
//
//     // ===== Управление временем =====
//     start() {
//         if (this.isRunning) return;
//         this.isRunning = true;
//         this._lastTime = performance.now();
//         this._fpsLastCheck = this._lastTime;
//         requestAnimationFrame(this._tick);
//     }
//
//     stop() {
//         this.isRunning = false;
//     }
//
//     setTimeScale(scale) {
//         this.timeScale = Math.max(0, scale);
//     }
//
//     // ===== Система приоритетов =====
//     addCallback(id, callback, priority = 'normal') {
//         this._callbacks.set(id, callback);
//         this._priorityQueues[priority].add(id);
//         if (!this.isRunning) this.start();
//         return () => this.removeCallback(id);
//     }
//
//     removeCallback(id) {
//         for (const queue of Object.values(this._priorityQueues)) {
//             if (queue.has(id)) {
//                 queue.delete(id);
//                 break;
//             }
//         }
//         this._callbacks.delete(id);
//     }
//
//     processCallbacks(dt) {
//         const phases = ['critical', 'high', 'normal', 'background'];
//         for (const phase of phases) {
//             for (const id of this._priorityQueues[phase]) {
//                 const callback = this._callbacks.get(id);
//                 if (callback) {
//                     try {
//                         callback(this.frameId, dt, this.elapsedTime);
//                     } catch (err) {
//                         console.error(`Callback error [${id}]:`, err);
//                     }
//                 }
//             }
//         }
//     }
//
//     // ===== Адаптивная детализация =====
//     evaluatePerformance() {
//         if (this.userLockedDetail) return;
//
//         const avgFps = this._optimizerState.fpsTrend.reduce((sum, fps) => sum + fps, 0) /
//             this._optimizerState.fpsTrend.length;
//
//         if (avgFps < 40 && this.detailLevel > 0) {
//             this.setDetailLevel(this.detailLevel - 1);
//         } else if (avgFps > 55 && this.detailLevel < 2) {
//             this.setDetailLevel(this.detailLevel + 1);
//         }
//
//         this._optimizerState.fpsTrend = [];
//         this._optimizerState.lastCheck = this.elapsedTime;
//     }
//
//     // ===== Фабрика контроллеров =====
//     createController(name, initialValues, preset = "gentle", options = {}) {
//         const config = this.configManager.getConfig(preset, options.config);
//         const controller = new Controller({
//             ...initialValues,
//             config,
//             ...options,
//         });
//
//         const api = {
//             controller,
//             name,
//             springs: controller.springs,
//
//             to: (values, customConfig) => {
//                 this.activeAnimations.add(name);
//                 return controller.start({
//                     to: values,
//                     config: customConfig || config,
//                     onRest: () => {
//                         this.activeAnimations.delete(name);
//                         options.onComplete?.();
//                     },
//                 });
//             },
//
//             sequence: async (steps) => {
//                 for (const step of steps) {
//                     await controller.start(step);
//                     if (step.delay) {
//                         await new Promise((resolve) => setTimeout(resolve, step.delay));
//                     }
//                 }
//             },
//
//             dispose: () => {
//                 controller.stop();
//                 this.controllers.delete(name);
//                 this.activeAnimations.delete(name);
//             }
//         };
//
//         this.controllers.set(name, api);
//         return api;
//     }
//
//     // ===== Градиентные системы =====
//     createGradient(type, config = {}) {
//         return new GradientSystem(this, type, config);
//     }
//
//     // ===== Оптимизация видимости =====
//     optimizeVisibility(states) {
//         for (const [id, visible] of Object.entries(states)) {
//             this.visibilityStates.set(id, visible);
//         }
//
//         // Применяем оптимизации к фоновым задачам
//         this._priorityQueues.background.forEach(id => {
//             const compId = id.split(':')[0];
//             const visible = this.visibilityStates.get(compId);
//             const callback = this._callbacks.get(id);
//             if (callback) callback._active = !!visible;
//         });
//     }
//
//     // ===== Метрики =====
//     getMetrics() {
//         return {
//             fps: this.fps,
//             frameId: this.frameId,
//             elapsedTime: this.elapsedTime,
//             realElapsedTime: this.realElapsedTime,
//             timeScale: this.timeScale,
//             detailLevel: this.detailLevel,
//             activeCallbacks: this._callbacks.size,
//             activeControllers: this.controllers.size,
//             activeAnimations: this.activeAnimations.size,
//             isRunning: this.isRunning
//         };
//     }
// }
//
// export const animationEngine = new UnifiedAnimationEngine();
//
// // ===== 5. React Hooks =====
// export const useVisibilityAwareAnimation = (initialValues, options = {}) => {
//     const [ref, inView] = useInView({ threshold: options.threshold || 0.1 });
//     const id = useRef(`vis-${Math.random().toString(36).slice(2)}`).current;
//
//     const [controller] = useState(() =>
//         animationEngine.createController(id, initialValues, options.preset, options)
//     );
//
//     useEffect(() => {
//         animationEngine.optimizeVisibility({ [id]: inView });
//
//         if (inView && options.animate) {
//             controller.start(options.animate);
//         } else if (!options.triggerOnce && options.exit) {
//             controller.start(options.exit);
//         }
//
//         return () => {
//             animationEngine.optimizeVisibility({ [id]: false });
//             controller.dispose();
//         };
//     }, [inView, controller, id]);
//
//     return { ref, springs: controller.springs };
// };
//
// export const useThemeAnimation = (lightTheme, darkTheme, preset = "theme") => {
//     const [controller] = useState(() =>
//         animationEngine.createController(`theme-${Date.now()}`, lightTheme, preset)
//     );
//
//     useEffect(() => {
//         const updateTheme = () => {
//             const theme = window.uiStore?.theme || 'light';
//             controller.start(theme === 'dark' ? darkTheme : lightTheme);
//         };
//
//         updateTheme();
//         const disposer = reaction(() => window.uiStore?.theme, updateTheme);
//         return () => {
//             disposer();
//             controller.dispose();
//         };
//     }, [controller]);
//
//     return controller.springs;
// };
//
// export const useSyncedAnimation = (api, options = {}) => {
//     useEffect(() => {
//         const id = `sync-${Math.random().toString(36).slice(2)}`;
//
//         const callback = (frameId, deltaTime) => {
//             if (!options.paused) {
//                 const speedFactor = options.normalizeSpeed ? deltaTime / 16.67 : 1;
//                 api.update({ speedFactor });
//             }
//         };
//
//         const remove = animationEngine.addCallback(id, callback, options.priority);
//         return remove;
//     }, [api, options.priority, options.paused, options.normalizeSpeed]);
// };
// export const OptimizedAnimated = animated;
//
//
//
// class _core {
//     // Состояние
//     elapsedTime = 0;
//     realElapsedTime = 0;
//     fps = 0;
//     frameId = 0;
//     isRunning = false;
//     timeScale = 1.0;
//     detailLevel = 2; // 0: low, 1: medium, 2: high
//     userLockedDetail = false;
//
//     // Метрики
//     averageFrameTime = 0;
//     minFps = Infinity;
//     maxFps = 0;
//
//     // Внутренние
//     _lastTime = 0;
//     _callbacks = new Map();
//     _controllers = new Map();
//     _frameTimes = [];
//     _fpsCounter = 0;
//     _fpsLastCheck = 0;
//     _priorityQueues = {
//         critical: new Set(),
//         high: new Set(),
//         normal: new Set(),
//         background: new Set()
//     };
//     _optimizerState = {
//         lastCheck: 0,
//         lastChange: 0,
//         fpsTrend: []
//     };
//     _phases = {
//         read: new Set(),
//         update: new Set(),
//         write: new Set(),
//         finish: new Set()
//     };
//
//
// // ===== 1. Конфигурации и пресеты =====
//     const ANIMATION_PRESETS = {
//         instant: { tension: 1000, friction: 100, mass: 0.1 },
//         snappy: { tension: 400, friction: 25, mass: 0.8 },
//         gentle: { tension: 120, friction: 14, mass: 1 },
//         wobbly: { tension: 180, friction: 12, mass: 1 },
//         stiff: { tension: 210, friction: 20, mass: 1 },
//         micro: { tension: 300, friction: 10, mass: 0.2 },
//         page: { tension: 280, friction: 30, mass: 1.2 },
//         modal: { tension: 250, friction: 22, mass: 1 },
//         theme: { tension: 150, friction: 18, mass: 1.5 },
//         mobile: { tension: 200, friction: 25, mass: 1, clamp: true },
//         desktop: { tension: 350, friction: 28, mass: 0.9 },
//         reduced: { duration: 200, easing: "linear" }
//     };
//
//     const clamp = (v, mi = 0, ma = 1) => Math.min(ma, Math.max(mi, v));
//     const modHue = (h) => ((h % 360) + 360) % 360;
//
// // ===== 2. Адаптивная система конфигураций =====
//     class AdaptiveConfigManager {
//     constructor() {
//         this.deviceCapabilities = this.detectDevice();
//         this.userPreferences = this.getUserPreferences();
//     }
//
//     detectDevice() {
//         const isLowEnd = navigator.hardwareConcurrency <= 4 || window.devicePixelRatio < 1.5;
//         const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//         return { isLowEnd, prefersReducedMotion };
//     }
//
//     getUserPreferences() {
//         return JSON.parse(localStorage.getItem('animationPreferences') || {
//             animationIntensity: 1,
//             preferPerformance: false,
//             enableMicroAnimations: true
//         };
//     }
//
//     getConfig(preset, context = {}) {
//         let config = ANIMATION_PRESETS[preset] || ANIMATION_PRESETS.gentle;
//
//         if (this.deviceCapabilities.prefersReducedMotion) {
//             return ANIMATION_PRESETS.reduced;
//         }
//
//         if (this.deviceCapabilities.isLowEnd) {
//             config = { ...config, clamp: true, precision: 0.01 };
//         }
//
//         if (this.userPreferences.animationIntensity < 1) {
//             config = {
//                 ...config,
//                 tension: config.tension * this.userPreferences.animationIntensity,
//                 friction: config.friction * (2 - this.userPreferences.animationIntensity)
//             };
//         }
//
//         return { ...config, ...context };
//     }
// }
//
// // ===== 3. Система градиентов =====
// class GradientSystem {
//     constructor(core, type, config) {
//         this.core = core;
//         this.type = type;
//         this.config = config;
//         this.values = this.calculateInitialValues();
//         this.animationId = null;
//         makeAutoObservable(this);
//     }
//
//     calculateInitialValues() {
//         const { saturation = 0.8, lightness = 0.5, segments = 16,
//             startHue = 0, endHue = 360, dark = false, seed } = this.config;
//
//         const seg = Math.max(2, segments);
//         const step = 1 / (seg - 1);
//         const L = clamp(dark ? lightness * 0.8 : lightness);
//         const C = clamp(saturation);
//         const rng = seed ? seedrandom(seed) : Math.random;
//
//         return Array.from({ length: seg }, (_, i) => {
//             const t = i * step;
//             const hue = modHue(startHue + t * (endHue - startHue) + rng() * 1e-4);
//             return chroma.oklch(L, C, hue).hex();
//         });
//     }
//
//     animate(mode = "rotate", speed = 33) {
//         this.stopAnimation();
//         this.animationId = `gradient-${this.type}-${Math.random().toString(36).slice(2)}`;
//
//         this.core.addCallback(this.animationId, () => {
//             this.updateGradient();
//         }, 'background');
//     }
//
//     updateGradient() {
//         // Логика обновления градиента
//         runInAction(() => {
//             this.values = this.calculateCurrentValues();
//         });
//     }
//
//     stopAnimation() {
//         if (this.animationId) {
//             this.core.removeCallback(this.animationId);
//             this.animationId = null;
//         }
//     }
//
//     applyToElement(element) {
//         if (!element) return;
//         element.style.background = `linear-gradient(45deg, ${this.values.join(', ')})`;
//     }
// }
//
// // ===== 4. Основной движок анимаций =====
// class UnifiedAnimationEngine {
//     constructor() {
//         makeAutoObservable(this, {
//             springs: false,
//             controllers: false,
//             configManager: false,
//             composer: false,
//         });
//
//         this.configManager = new AdaptiveConfigManager();
//         this.springs = new Map();
//         this.controllers = new Map();
//         this.activeAnimations = new Set();
//         this.visibilityStates = new Map();
//
//         this.setupGlobalOptimizations();
//         this.createCoreAnimations();
//         this.setupReactions();
//     }
//
//     setupGlobalOptimizations() {
//         Globals.assign({
//             skipAnimation: this.configManager.deviceCapabilities.prefersReducedMotion,
//             frameLoop: this.configManager.deviceCapabilities.isLowEnd ? "demand" : "always",
//             requestAnimationFrame: (cb) => {
//                 const id = `raf-${Date.now()}`;
//                 this.addCallback(id, () => cb(performance.now()), 'critical');
//                 return () => this.removeCallback(id);
//             }
//         });
//     }
//
//     createCoreAnimations() {
//         // Анимации страницы
//         this.page = this.createController("page", {
//             x: 225,
//             y: -50,
//             scale: 1.7,
//             opacity: 1
//         }, "page");
//
//         // Анимации темы
//         this.theme = this.createController("theme", {
//             background: "#ffffff",
//             textColor: "#000000",
//             highlightColor: "#0066cc",
//             borderRadius: 4
//         }, "theme");
//     }
//
//     setupReactions() {
//         reaction(
//             () => window.uiStore?.theme,
//             (theme) => this.animateThemeChange(theme),
//             { fireImmediately: true }
//         );
//     }
//
//     async animateThemeChange(theme) {
//         const themeValues = theme === "dark"
//             ? { background: "#222222", textColor: "#ffffff", highlightColor: "#66ccff", borderRadius: 8 }
//             : { background: "#ffffff", textColor: "#000000", highlightColor: "#0066cc", borderRadius: 4 };
//
//         await this.theme.start(themeValues);
//     }
//
//     // ===== Управление временем =====
//     start() {
//         if (this.isRunning) return;
//         this.isRunning = true;
//         this._lastTime = performance.now();
//         this._fpsLastCheck = this._lastTime;
//         requestAnimationFrame(this._tick);
//     }
//
//     stop() {
//         this.isRunning = false;
//     }
//
//     setTimeScale(scale) {
//         this.timeScale = Math.max(0, scale);
//     }
//
//     // ===== Система приоритетов =====
//     addCallback(id, callback, priority = 'normal') {
//         this._callbacks.set(id, callback);
//         this._priorityQueues[priority].add(id);
//         if (!this.isRunning) this.start();
//         return () => this.removeCallback(id);
//     }
//
//     removeCallback(id) {
//         for (const queue of Object.values(this._priorityQueues)) {
//             if (queue.has(id)) {
//                 queue.delete(id);
//                 break;
//             }
//         }
//         this._callbacks.delete(id);
//     }
//
//     processCallbacks(dt) {
//         const phases = ['critical', 'high', 'normal', 'background'];
//         for (const phase of phases) {
//             for (const id of this._priorityQueues[phase]) {
//                 const callback = this._callbacks.get(id);
//                 if (callback) {
//                     try {
//                         callback(this.frameId, dt, this.elapsedTime);
//                     } catch (err) {
//                         console.error(`Callback error [${id}]:`, err);
//                     }
//                 }
//             }
//         }
//     }
//
//     // ===== Адаптивная детализация =====
//     evaluatePerformance() {
//         if (this.userLockedDetail) return;
//
//         const avgFps = this._optimizerState.fpsTrend.reduce((sum, fps) => sum + fps, 0) /
//             this._optimizerState.fpsTrend.length;
//
//         if (avgFps < 40 && this.detailLevel > 0) {
//             this.setDetailLevel(this.detailLevel - 1);
//         } else if (avgFps > 55 && this.detailLevel < 2) {
//             this.setDetailLevel(this.detailLevel + 1);
//         }
//
//         this._optimizerState.fpsTrend = [];
//         this._optimizerState.lastCheck = this.elapsedTime;
//     }
//
//     // ===== Фабрика контроллеров =====
//     createController(name, initialValues, preset = "gentle", options = {}) {
//         const config = this.configManager.getConfig(preset, options.config);
//         const controller = new Controller({
//             ...initialValues,
//             config,
//             ...options,
//         });
//
//         const api = {
//             controller,
//             name,
//             springs: controller.springs,
//
//             to: (values, customConfig) => {
//                 this.activeAnimations.add(name);
//                 return controller.start({
//                     to: values,
//                     config: customConfig || config,
//                     onRest: () => {
//                         this.activeAnimations.delete(name);
//                         options.onComplete?.();
//                     },
//                 });
//             },
//
//             sequence: async (steps) => {
//                 for (const step of steps) {
//                     await controller.start(step);
//                     if (step.delay) {
//                         await new Promise((resolve) => setTimeout(resolve, step.delay));
//                     }
//                 }
//             },
//
//             dispose: () => {
//                 controller.stop();
//                 this.controllers.delete(name);
//                 this.activeAnimations.delete(name);
//             }
//         };
//
//         this.controllers.set(name, api);
//         return api;
//     }
//
//     // ===== Градиентные системы =====
//     createGradient(type, config = {}) {
//         return new GradientSystem(this, type, config);
//     }
//
//     // ===== Оптимизация видимости =====
//     optimizeVisibility(states) {
//         for (const [id, visible] of Object.entries(states)) {
//             this.visibilityStates.set(id, visible);
//         }
//
//         // Применяем оптимизации к фоновым задачам
//         this._priorityQueues.background.forEach(id => {
//             const compId = id.split(':')[0];
//             const visible = this.visibilityStates.get(compId);
//             const callback = this._callbacks.get(id);
//             if (callback) callback._active = !!visible;
//         });
//     }
//
//     // ===== Метрики =====
//     getMetrics() {
//         return {
//             fps: this.fps,
//             frameId: this.frameId,
//             elapsedTime: this.elapsedTime,
//             realElapsedTime: this.realElapsedTime,
//             timeScale: this.timeScale,
//             detailLevel: this.detailLevel,
//             activeCallbacks: this._callbacks.size,
//             activeControllers: this.controllers.size,
//             activeAnimations: this.activeAnimations.size,
//             isRunning: this.isRunning
//         };
//     }
// }
//
// export const animationEngine = new UnifiedAnimationEngine();
//
// // ===== 5. React Hooks =====
// export const useVisibilityAwareAnimation = (initialValues, options = {}) => {
//     const [ref, inView] = useInView({ threshold: options.threshold || 0.1 });
//     const id = useRef(`vis-${Math.random().toString(36).slice(2)}`).current;
//
//     const [controller] = useState(() =>
//         animationEngine.createController(id, initialValues, options.preset, options)
//     );
//
//     useEffect(() => {
//         animationEngine.optimizeVisibility({ [id]: inView });
//
//         if (inView && options.animate) {
//             controller.start(options.animate);
//         } else if (!options.triggerOnce && options.exit) {
//             controller.start(options.exit);
//         }
//
//         return () => {
//             animationEngine.optimizeVisibility({ [id]: false });
//             controller.dispose();
//         };
//     }, [inView, controller, id]);
//
//     return { ref, springs: controller.springs };
// };
//
// export const useThemeAnimation = (lightTheme, darkTheme, preset = "theme") => {
//     const [controller] = useState(() =>
//         animationEngine.createController(`theme-${Date.now()}`, lightTheme, preset)
//     );
//
//     useEffect(() => {
//         const updateTheme = () => {
//             const theme = window.uiStore?.theme || 'light';
//             controller.start(theme === 'dark' ? darkTheme : lightTheme);
//         };
//
//         updateTheme();
//         const disposer = reaction(() => window.uiStore?.theme, updateTheme);
//         return () => {
//             disposer();
//             controller.dispose();
//         };
//     }, [controller]);
//
//     return controller.springs;
// };
//
// export const useSyncedAnimation = (api, options = {}) => {
//     useEffect(() => {
//         const id = `sync-${Math.random().toString(36).slice(2)}`;
//
//         const callback = (frameId, deltaTime) => {
//             if (!options.paused) {
//                 const speedFactor = options.normalizeSpeed ? deltaTime / 16.67 : 1;
//                 api.update({ speedFactor });
//             }
//         };
//
//         const remove = animationEngine.addCallback(id, callback, options.priority);
//         return remove;
//     }, [api, options.priority, options.paused, options.normalizeSpeed]);
// };
//
// export const OptimizedAnimated = animated;
//
//     constructor() {
//         makeAutoObservable(this, {
//             _callbacks: false,
//             _controllers: false,
//             _priorityQueues: false
//         });
//
//         raf.frameLoop = 'demand';
//         this.setupRAF();
//     }
//
//     setupRAF() {
//         const tick = (now) => {
//             if (!this.isRunning) return;
//
//             // Реальное время
//             const realDt = Math.min(now - this._lastTime, 1000 / 15);
//             this._lastTime = now;
//             this.realElapsedTime += realDt;
//
//             // Масштабированное время
//             const scaledDt = realDt * this.timeScale;
//             runInAction(() => {
//                 this.elapsedTime += scaledDt;
//                 this.frameId++;
//             });
//
//             // Обновление метрик
//             this.updateFPS(now);
//             this.updatePerformanceStats(realDt);
//
//             // Обработка коллбэков по приоритетам
//             this.processCallbacks(scaledDt);
//
//             // Автооптимизация детализации
//             if (this.elapsedTime - this._optimizerState.lastCheck > 5000) {
//                 this.evaluatePerformance();
//             }
//
//             raf.advance(scaledDt);
//             requestAnimationFrame(tick);
//         };
//
//         this._tick = tick;
//     }
//
//     // Обработка коллбэков по приоритетам
//     processCallbacks(dt) {
//         const phases = ['critical', 'high', 'normal', 'background'];
//         for (const phase of phases) {
//             this._priorityQueues[phase].forEach(id => {
//                 const callback = this._callbacks.get(id);
//                 if (callback) {
//                     try {
//                         callback(this.frameId, dt, this.elapsedTime);
//                     } catch (err) {
//                         console.error(`Callback error [${id}]:`, err);
//                     }
//                 }
//             });
//         }
//     }
//
//     // Автоматическая оптимизация детализации
//     evaluatePerformance() {
//         if (this.userLockedDetail) return;
//
//         const {fpsTrend} = this._optimizerState;
//         const avgFps = fpsTrend.reduce((sum, fps) => sum + fps, 0) / fpsTrend.length;
//
//         if (avgFps < 40 && this.detailLevel > 0) {
//             this.setDetailLevel(this.detailLevel - 1);
//         } else if (avgFps > 55 && this.detailLevel < 2) {
//             this.setDetailLevel(this.detailLevel + 1);
//         }
//
//         this._optimizerState.fpsTrend = [];
//         this._optimizerState.lastCheck = this.elapsedTime;
//     }
//
//     // Обновление статистики производительности
//     updatePerformanceStats(dt) {
//         this._frameTimes.push(dt);
//         if (this._frameTimes.length > 60) this._frameTimes.shift();
//
//         const total = this._frameTimes.reduce((sum, t) => sum + t, 0);
//         this.averageFrameTime = total / this._frameTimes.length;
//
//         this.minFps = Math.min(this.minFps, 1000 / dt);
//         this.maxFps = Math.max(this.maxFps, 1000 / dt);
//     }
//
//     updateFPS(now) {
//         this._fpsCounter++;
//         if (now - this._fpsLastCheck >= 1000) {
//             runInAction(() => {
//                 this.fps = this._fpsCounter;
//                 this._optimizerState.fpsTrend.push(this.fps);
//                 if (this._optimizerState.fpsTrend.length > 5) {
//                     this._optimizerState.fpsTrend.shift();
//                 }
//             });
//             this._fpsCounter = 0;
//             this._fpsLastCheck = now;
//         }
//     }
//
//     // Публичные методы
//     start() {
//         if (this.isRunning) return;
//         this.isRunning = true;
//         this._lastTime = performance.now();
//         this._fpsLastCheck = this._lastTime;
//         requestAnimationFrame(this._tick);
//     }
//
//     stop() {
//         this.isRunning = false;
//     }
//
//     setTimeScale(scale) {
//         this.timeScale = Math.max(0, scale);
//     }
//
//     setDetailLevel(level) {
//         this.detailLevel = Math.max(0, Math.min(2, level));
//         this._optimizerState.lastChange = this.elapsedTime;
//     }
//
//     lockDetailLevel(level) {
//         this.setDetailLevel(level);
//         this.userLockedDetail = true;
//     }
//
//     unlockDetailLevel() {
//         this.userLockedDetail = false;
//     }
//
//     // Регистрация коллбэков с приоритетом
//     addCallback(id, callback, priority = 'normal') {
//         this._callbacks.set(id, callback);
//         this._priorityQueues[priority].add(id);
//
//         if (!this.isRunning) this.start();
//         return () => {
//             this._callbacks.delete(id);
//             this._priorityQueues[priority].delete(id);
//         };
//     }
//
//     removeCallback(id) {
//         for (const queue of Object.values(this._priorityQueues)) {
//             if (queue.has(id)) {
//                 queue.delete(id);
//                 break;
//             }
//         }
//         this._callbacks.delete(id);
//     }
//
//     // Градиентные системы
//     createGradient(type, config = {}) {
//         return new GradientSystem(this, type, config);
//     }
//
//     // Контроллеры анимации
//     createController(name, initialValues, config = {}) {
//         // ... (аналогично предыдущей реализации)
//     }
//
//     createController(name, initialValues, config = {}) {
//         const controller = new Controller({
//             ...initialValues,
//             config: {
//                 tension: 180,
//                 friction: 20,
//                 mass: 1,
//                 ...config
//             }
//         });
//
//         // Параллельный запуск анимаций
//         const parallel = async (animations) => {
//             // Создаем GPU tasks
//             const gpuTasks = [];
//
//             // Создаем CPU tasks
//             const cpuTasks = [];
//
//             animations.forEach(anim => {
//                 if (this.state.gpuAccelerated && anim.gpuAccelerated) {
//                     gpuTasks.push(() => this._runGpuAnimation(anim));
//                 } else {
//                     cpuTasks.push(() => controller.start(anim));
//                 }
//             });
//
//             // Запускаем GPU анимации в параллельных потоках
//             const gpuPromises = gpuTasks.map(task => {
//                 return new Promise(resolve => {
//                     const worker = new Worker('gpu-animation.worker.js');
//                     worker.postMessage({task});
//                     worker.onmessage = (e) => {
//                         resolve(e.data);
//                         worker.terminate();
//                     };
//                 });
//             });
//
//             // Запускаем CPU анимации последовательно
//             const cpuResults = [];
//             for (const task of cpuTasks) {
//                 cpuResults.push(await task());
//             }
//
//             // Ждем завершения всех анимаций
//             return Promise.all([...gpuPromises, ...cpuResults]);
//         };
//
//         // Создание spring контроллеров
//         createController(name, initialValues, config = {})
//         {
//             const controller = new Controller({
//                 ...initialValues,
//                 config: {
//                     tension: 180,
//                     friction: 20,
//                     mass: 1,
//                     ...config
//                 }
//             });
//
//             const api = {
//                 name,
//                 controller,
//                 springs: controller.springs,
//
//                 to: (values, animConfig) => {
//                     return controller.start({
//                         to: values,
//                         config: animConfig || controller.springs.config
//                     });
//                 },
//
//                 getValues: () => controller.get(),
//
//                 sequence: async (steps) => {
//                     for (const step of steps) {
//                         await controller.start(step);
//                         if (step.delay) {
//                             await new Promise(r => setTimeout(r, step.delay));
//                         }
//                     }
//                 },
//
//                 pause: () => controller.pause(),
//                 resume: () => controller.resume(),
//                 stop: () => controller.stop(),
//
//                 dispose: () => {
//                     controller.stop();
//                     this._controllers.delete(name);
//                 }
//             };
//
//             this._controllers.set(name, api);
//             return api;
//         }
//
//         getController(name)
//         {
//             return this._controllers.get(name);
//         }
//
//         // Простая анимация элементов
//         animateElement(element, values, config = {})
//         {
//             if (!element) return null;
//
//             const {
//                 duration = 1000,
//                 easing = 'ease-out',
//                 type = 'css'
//             } = config;
//
//             if (type === 'css') {
//                 return this.animateWithCSS(element, values, {duration, easing});
//             } else if (type === 'spring') {
//                 return this.animateWithSpring(element, values, config);
//             }
//
//             return null;
//         }
//
//         animateWithCSS(element, values, {duration, easing})
//         {
//             return new Promise((resolve) => {
//                 const keyframes = [];
//                 const properties = Object.keys(values);
//
//                 // Получаем начальные значения
//                 const startValues = {};
//                 properties.forEach(prop => {
//                     const computed = getComputedStyle(element);
//                     startValues[prop] = computed[prop] || '0';
//                 });
//
//                 // Создаем keyframes
//                 keyframes.push(startValues);
//                 keyframes.push(values);
//
//                 const animation = element.animate(keyframes, {
//                     duration,
//                     easing,
//                     fill: 'forwards'
//                 });
//
//                 animation.onfinish = () => {
//                     // Применяем финальные стили
//                     Object.assign(element.style, values);
//                     resolve(animation);
//                 };
//             });
//         }
//
//         animateWithSpring(element, values, config)
//         {
//             const controller = this.createController(
//                 `element-${Math.random().toString(36).slice(2)}`,
//                 {},
//                 config
//             );
//
//             // Получаем текущие значения
//             const currentValues = {};
//             Object.keys(values).forEach(prop => {
//                 const computed = getComputedStyle(element);
//                 currentValues[prop] = parseFloat(computed[prop]) || 0;
//             });
//
//             controller.controller.set(currentValues);
//
//             // Анимируем
//             controller.controller.start({
//                 to: values,
//                 onChange: (result) => {
//                     Object.keys(result.value).forEach(prop => {
//                         const value = result.value[prop];
//                         if (prop === 'opacity' || prop === 'scale') {
//                             element.style[prop] = value;
//                         } else {
//                             element.style[prop] = `${value}px`;
//                         }
//                     });
//                 }
//             });
//
//             return controller;
//         }
//
//         // Метрики
//         getMetrics()
//         {
//             return {
//                 fps: this.fps,
//                 frameId: this.frameId,
//                 elapsedTime: this.elapsedTime,
//                 timeScale: this.timeScale,
//                 activeCallbacks: this._callbacks.size,
//                 activeControllers: this._controllers.size,
//                 isRunning: this.isRunning
//             };
//         }
//     }
//
//     createController(name, initialValues, config = {}) {
//         const controller = new Controller({
//             ...initialValues,
//             config: {
//                 tension: 180,
//                 friction: 20,
//                 mass: 1,
//                 ...config
//             }
//         });
//
//         // Добавляем поддержку параллельных анимаций
//         const parallel = async (animations) => {
//             // Создаем GPU-контекст если доступно
//             const gpuContext = this.state.gpuAccelerated ? this._gpuContext : null;
//
//             // Запускаем анимации параллельно
//             const promises = animations.map(anim => {
//                 return new Promise(resolve => {
//                     // Для GPU используем специальный метод
//                     if (gpuContext && anim.gpuAccelerated) {
//                         this._runGpuAnimation(controller, anim, resolve);
//                     } else {
//                         // CPU-анимация
//                         controller.start({
//                             ...anim,
//                             onRest: resolve
//                         });
//                     }
//                 });
//             });
//
//             return Promise.all(promises);
//         };
//
//         const api = {
//             name,
//             controller,
//             springs: controller.springs,
//
//             to: (values, animConfig) => {
//                 return controller.start({
//                     to: values,
//                     config: animConfig || controller.springs.config
//                 });
//             },
//
//             // Параллельное выполнение анимаций
//             parallel,
//
//             // Последовательное выполнение с возможностью пауз
//             sequence: async (steps) => {
//                 for (const step of steps) {
//                     await controller.start(step);
//                     if (step.delay) {
//                         await new Promise(r => setTimeout(r, step.delay));
//                     }
//                 }
//             },
//
//             // ... остальные методы ...
//
//             // GPU-ускорение для контроллера
//             enableGPU: () => {
//                 if (this.state.gpuAccelerated) {
//                     controller._gpuEnabled = true;
//                     return true;
//                 }
//                 return false;
//             }
//         };
//
//         this._controllers.set(name, api);
//         return api;
//     }
//
//     // Запуск анимации на GPU
//     _runGpuAnimation(controller, anim, resolve) {
//         // Создаем GPU-буферы
//         const inputBuffer = this._gpuContext.createBuffer({
//             size: Float32Array.BYTES_PER_ELEMENT * anim.values.length,
//             usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
//         });
//
//         // ... GPU-вычисления ...
//
//         // Обновление значений в основном потоке
//         const updateFromGpu = (result) => {
//             controller.set(result);
//         };
//
//         // Запускаем GPU-расчеты
//         this._gpuComputePass(anim, inputBuffer, updateFromGpu, resolve);
//     }
//
//
//     _initGradient() {
//         // Создаем SpringValue для каждого параметра
//         this.springs.angle = core.createSpringValue(0, {
//             tension: 120,
//             friction: 14
//         });
//
//         this.springs.colors = core.createSpringValue(
//             this._getInitialColors(),
//             {tension: 90, friction: 10}
//         );
//
//         // ... другие параметры ...
//     }
//
//     animate(target) {
//         // Параллельная анимация параметров
//         core.parallel([
//             {
//                 execute: () => this.springs.angle.set(target.angle),
//                 complexity: 2
//             },
//             {
//                 execute: () => this.springs.colors.set(target.colors),
//                 complexity: 7 // Сложная задача -> Worker
//             }
//         ]);
//     }
//
//     applyTo(element) {
//         // Фаза записи
//         core.addToPhase('write', () => {
//             const angle = this.springs.angle.get();
//             const colors = this.springs.colors.get();
//             element.style.background = `linear-gradient(${angle}deg, ${colors.join(', ')})`;
//         });
//     }
//
//     createSpringValue(initialValue, config = {}) {
//         const name = `spring-${Math.random().toString(36).slice(2)}`;
//         const controller = this.createController(name, {value: initialValue}, config);
//
//         return {
//             get: () => controller.getValues().value,
//             set: (value) => controller.to({value}),
//             onChange: (callback) => {
//                 return this.addCallback(`${name}-change`, () => {
//                     callback(controller.getValues().value);
//                 });
//             },
//             dispose: () => controller.dispose()
//         };
//     }
//
//     // Получение метрик
//     getMetrics() {
//         return {
//             fps: this.fps,
//             frameId: this.frameId,
//             elapsedTime: this.elapsedTime,
//             realElapsedTime: this.realElapsedTime,
//             timeScale: this.timeScale,
//             detailLevel: this.detailLevel,
//             averageFrameTime: this.averageFrameTime,
//             minFps: this.minFps,
//             maxFps: this.maxFps,
//             activeCallbacks: this._callbacks.size,
//             activeControllers: this._controllers.size,
//             isRunning: this.isRunning
//         };
//     }
//
//     setupRAF() {
//         // Единый цикл через RAF
//         const tick = (now) => {
//             if (!this.isRunning) return;
//
//             const dt = Math.min(now - this._lastTime, 1000 / 15); // защита от больших скачков
//             this._lastTime = now;
//
//             const scaledDt = dt * this.timeScale;
//
//             runInAction(() => {
//                 this.elapsedTime += scaledDt;
//                 this.frameId++;
//             });
//
//             // Продвигаем RAF
//             raf.advance(scaledDt);
//
//             // Вызываем коллбэки
//             this._callbacks.forEach((callback, id) => {
//                 try {
//                     callback(this.frameId, scaledDt, this.elapsedTime);
//                 } catch (err) {
//                     console.error(`Animation callback error [${id}]:`, err);
//                 }
//             });
//
//             // FPS метрики
//             this.updateFPS(now);
//
//             // Следующий кадр
//             requestAnimationFrame(tick);
//         };
//
//         this._tick = tick;
//     }
//
//     updateFPS(now) {
//         this._fpsCounter++;
//         if (now - this._fpsLastCheck >= 1000) {
//             runInAction(() => {
//                 this.fps = this._fpsCounter;
//             });
//             this._fpsCounter = 0;
//             this._fpsLastCheck = now;
//         }
//     }
//
//     // Публичные методы
//     start() {
//         if (this.isRunning) return;
//         this.isRunning = true;
//         this._lastTime = performance.now();
//         this._fpsLastCheck = this._lastTime;
//         requestAnimationFrame(this._tick);
//     }
//
//     stop() {
//         this.isRunning = false;
//     }
//
//     setTimeScale(scale) {
//         this.timeScale = Math.max(0, scale);
//     }
//
//     // Регистрация коллбэков
//     addCallback(id, callback) {
//         this._callbacks.set(id, callback);
//         if (!this.isRunning) this.start();
//         return () => this._callbacks.delete(id);
//     }
//
//     removeCallback(id) {
//         this._callbacks.delete(id);
//     }
//
//     registerPhases() {
//         raf.onStart(() => this._processPhase('read'));
//         raf.onFrame(() => this._processPhase('update'));
//         raf.write(() => this._processPhase('write'));
//         raf.onFinish(() => this._processPhase('finish'));
//     }
//
//     addToPhase(phase, task) {
//         this._phases[phase].add(task);
//         return () => this._phases[phase].delete(task);
//     }
//
//     _processPhase(phase) {
//         this._phases[phase].forEach(task => {
//             try {
//                 task();
//             } catch (e) {
//                 console.error(`Phase ${phase} error:`, e);
//             }
//         });
//     }
//
//
// }
//
// // Экспорт единственного экземпляра
// export const core = new _core();
//
// // ===== 2. AnimationPresets.js =====
// // Вынесем пресеты отдельно
// export const ANIMATION_PRESETS = {
//     // Базовые
//     instant: {tension: 1000, friction: 100, mass: 0.1},
//     snappy: {tension: 400, friction: 25, mass: 0.8},
//     gentle: {tension: 120, friction: 14, mass: 1},
//     wobbly: {tension: 180, friction: 12, mass: 1},
//     stiff: {tension: 210, friction: 20, mass: 1},
//
//     // Специализированные
//     ultraSpring: {
//         tension: 50,
//         friction: 75,
//         mass: 5,
//         damping: 100,
//         precision: 0.0001
//     },
//     micro: {tension: 300, friction: 10, mass: 0.2},
//     page: {tension: 280, friction: 30, mass: 1.2},
//     modal: {tension: 250, friction: 22, mass: 1},
//     theme: {tension: 150, friction: 18, mass: 1.5},
//
//     // Контекстуальные
//     mobile: {tension: 200, friction: 25, mass: 1, clamp: true},
//     desktop: {tension: 350, friction: 28, mass: 0.9},
//     reduced: {duration: 200, easing: "linear"}
// };
//
// export const EASING_FUNCTIONS = {
//     easeOut: (t) => 1 - Math.pow(1 - t, 3),
//     easeIn: (t) => t * t * t,
//     easeInOut: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
//     elastic: (t) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI)
// };
//
// // ===== 3. AnimationUtils.js =====
// // Утилиты и хуки
// import {useEffect, useRef, useState} from 'react';
//
// export const useAnimation = (config = {}) => {
//     const controllerRef = useRef(null);
//
//     useEffect(() => {
//         const id = `hook-${Math.random().toString(36).slice(2)}`;
//         controllerRef.current = core.createController(id, {}, config);
//
//         return () => {
//             controllerRef.current?.dispose();
//         };
//     }, []);
//
//     return {
//         controller: controllerRef.current,
//         animate: (values, animConfig) => controllerRef.current?.to(values, animConfig),
//         stop: () => controllerRef.current?.stop(),
//         pause: () => controllerRef.current?.pause(),
//         resume: () => controllerRef.current?.resume()
//     };
// };
//
// export const useAnimationFrame = (callback) => {
//     const callbackRef = useRef(callback);
//     callbackRef.current = callback;
//
//     useEffect(() => {
//         const id = `frame-${Math.random().toString(36).slice(2)}`;
//         const dispose = core.addCallback(id, (...args) => {
//             callbackRef.current?.(...args);
//         });
//
//         return dispose;
//     }, []);
// };
//
// export const useAnimationMetrics = () => {
//     const [metrics, setMetrics] = useState(core.getMetrics());
//
//     useEffect(() => {
//         const id = `metrics-${Math.random().toString(36).slice(2)}`;
//         const dispose = core.addCallback(id, () => {
//             setMetrics(core.getMetrics());
//         });
//
//         return dispose;
//     }, []);
//
//     return metrics;
// };
//
// import {useEffect, useRef} from 'react';
// import {core} from './_core.js';
//
// // Хук для синхронизации Spring
// export const useSpringSync = (api, priority = 'normal') => {
//     const id = useRef(`spring-${Math.random().toString(36).slice(2)}`).current;
//
//     useEffect(() => {
//         const callback = () => {
//             if (api && typeof api.update === 'function') {
//                 api.update();
//             }
//         };
//
//         const remove = core.addCallback(id, callback, priority);
//         return remove;
//     }, [api, priority]);
// };
//
// // Хук для градиентов
// export const useGradient = (type, config) => {
//     const [gradient, setGradient] = useState(() =>
//         core.createGradient(type, config)
//     );
//
//     useEffect(() => {
//         gradient.animate(config.mode, config.speed);
//         return () => gradient.stopAnimation();
//     }, [gradient, config]);
//
//     return gradient;
// };
//
// // Хук для данных таймера
// export const useTimerData = () => {
//     const [data, setData] = useState(core.getMetrics());
//
//     useEffect(() => {
//         const id = 'timer-data';
//         core.addCallback(id, () => {
//             setData(core.getMetrics());
//         });
//         return () => core.removeCallback(id);
//     }, []);
//
//     return data;
// };
//
// // Упрощённый координатор
// import {raf} from "@react-spring/rafz";
//
// import {core} from './_core.js';
// import {observer} from 'mobx-react-lite';
//
// const AnimatedCircle = observer(() => {
//     const scaleRef = useRef(core.createSpringValue(1, {tension: 250}));
//
//     useEffect(() => {
//         return () => scaleRef.current.dispose();
//     }, []);
//
//     return (
//         <div
//             style={{
//                 transform: `scale(${scaleRef.current.get()})`,
//                 width: 50,
//                 height: 50,
//                 background: 'blue',
//                 borderRadius: '50%'
//             }}
//             onClick={() => scaleRef.current.set(1.5)}
//         />
//     );
// });
//
// import {useGradient, useTimerData} from './hooks';
//
// const AnimatedBackground = () => {
//     const gradient = useGradient('rainbow', {
//         segments: 12,
//         speed: 50
//     });
//
//     const metrics = useTimerData();
//
//     return (
//         <div style={{
//             background: `linear-gradient(45deg, ${gradient.values.join(', ')})`,
//             width: '100%',
//             height: '100vh'
//         }}>
//             <div>FPS: {metrics.fps.toFixed(1)}</div>
//             <div>Detail: {['Low', 'Medium', 'High'][metrics.detailLevel]}</div>
//         </div>
//     );
// };
//
// import {useSprings, animated} from '@react-spring/web';
//
// const ParallelAnimations = () => {
//     // Создаем несколько независимых анимаций
//     const [springs, api] = useSprings(5, () => ({
//         opacity: 0.5,
//         scale: 1,
//         config: {
//             tension: 300,
//             friction: 25,
//             // Активируем GPU ускорение
//             gpuAccelerated: true
//         }
//     }));
//
//     const startParallel = () => {
//         // Запускаем все анимации параллельно
//         api.start(index => ({
//             opacity: 1,
//             scale: 1.2 + index * 0.1,
//             delay: index * 100
//         }));
//     };
//
//     return (
//         <div>
//             {springs.map((props, i) => (
//                 <animated.div
//                     key={i}
//                     style={{
//                         opacity: props.opacity,
//                         transform: props.scale.to(s => `scale(${s})`)
//                     }}
//                 />
//             ))}
//             <button onClick={startParallel}>Запустить параллельно</button>
//         </div>
//     );
// };
//
// export const SVGNoiseFilter = () => (
//     <svg className="hidden">
//         <filter id="noise">
//             <feTurbulence
//                 type="fractalNoise"
//                 baseFrequency="0.65"
//                 numOctaves="3"
//                 stitchTiles="stitch"
//             />
//             <feColorMatrix type="saturate" values="0"/>
//         </filter>
//
//         <filter id="fluid">
//             <feTurbulence baseFrequency="0.02" numOctaves="3"/>
//             <feDisplacementMap in="SourceGraphic" scale="15"/>
//         </filter>
//     </svg>
// );
//
// export const applySVGEffect = (effect: string) => ({
//     style: {filter: `url(#${effect})`}
// });
//
// class RafzCoordinator {
//     constructor() {
//         this.callbacks = {
//             start: new Set(),
//             frame: new Set(),
//             finish: new Set(),
//             write: new Set()
//         };
//
//         raf.frameLoop = 'demand';
//         this.setupHooks();
//     }
//
//     setupHooks() {
//         raf.onStart(() => this.runCallbacks('start'));
//         raf.onFrame(() => this.runCallbacks('frame'));
//         raf.onFinish(() => this.runCallbacks('finish'));
//         raf.write(() => this.runCallbacks('write'));
//     }
//
//     runCallbacks(phase) {
//         this.callbacks[phase].forEach(cb => {
//             try {
//                 cb(raf.now());
//             } catch (err) {
//                 console.error(`RafzCoordinator ${phase} error:`, err);
//             }
//         });
//     }
//
//     addCallback(phase, callback) {
//         this.callbacks[phase].add(callback);
//         return () => this.callbacks[phase].delete(callback);
//     }
// }
//
// export const rafzCoordinator = new RafzCoordinator();
//
// // Простые функции для быстрого использования
// export const animate = (element, values, config) => {
//     return core.animateElement(element, values, config);
// };
//
// export const spring = (element, values, config = {}) => {
//     return core.animateElement(element, values, {
//         type: 'spring',
//         ...config
//     });
// };
//
// export const css = (element, values, config = {}) => {
//     return core.animateElement(element, values, {
//         type: 'css',
//         ...config
//     });
// };
//
// // ===== 4. Исправленный gradient.js (фрагмент) =====
// // Убираем циклические зависимости
// class GradientStore {
//     // ... остальной код ...
//
//     constructor() {
//         makeAutoObservable(this, {calculateTheme: action});
//
//         // Создаем контроллер через движок
//         this.themeController = createController(
//             "mainThemeController",
//             {
//                 opacity: 1,
//                 scale: 1
//             },
//             ANIMATION_PRESETS.ultraSpring
//         );
//     }
//
//     // Убираем async getter
//     _uiStore = null;
//
//     get uiStore() {
//         return this._uiStore;
//     }
//
//     get getTheme() {
//         if (!this.uiStore) return {};
//
//         const theme = this.getColorTheme(
//             this.uiStore.themeIsDark ? STANDART_DARK : STANDART_LIGHT
//         );
//
//         return {
//             ...theme,
//             bWG: this.blackWhiteGradient,
//             // Добавляем анимированные значения
//             animated: this.themeController.springs
//         };
//     }
//
//     setUIStore(uiStore) {
//         this._uiStore = uiStore;
//     }
//
//     // ... остальные методы без изменений ...
// }
//
// // ===== 5. Пример использования =====
// /*
//  // В компоненте:
//  import { useAnimation, animate, spring } from './Corecore';
//
//  function MyComponent() {
//  const { animate: springAnimate } = useAnimation({
//  tension: 200,
//  friction: 20
//  });
//
//  const handleClick = () => {
//  // Простая CSS анимация
//  animate(elementRef.current, {
//  opacity: 0.5,
//  transform: 'scale(1.1)'
//  }, {
//  duration: 300
//  });
//
//  // Или spring анимация
//  spring(elementRef.current, {
//  scale: 1.2,
//  opacity: 0.8
//  }, {
//  tension: 300,
//  friction: 15
//  });
//  };
//
//  return <div ref={elementRef} onClick={handleClick}>Animate me!</div>;
//  }
//  */
