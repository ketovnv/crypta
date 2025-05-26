// import { action, makeAutoObservable, observable, reaction, when } from "mobx";
// import { uiStore } from "./ui";
// import { timeEngine as engine } from "./timeEngine.js";
// import { gradientStore } from "./gradient";
// import { Globals, SpringValue, Controller } from "@react-spring/web";
// import { windowStore } from "@stores/window.js";
// import { gpuStore } from "@stores/gpuStore.js";
// import { rafzCoordinator, raf } from "@animations/unified/RafzCoordinator";
// import { logger } from "@stores/logger.js";
// // import { unifiedAnimationEngine } from "@animations/unified/UnifiedAnimationEngine.js";
// // import { modernAnimationEngine } from "@animations/unified/ModernAnimationEngine";
// // import { modernAnimationEngine } from "@animations/unified/ModernAnimationEngine";

// const APP_NAME = "ReactApproveAppkit";
// const appNameArray = APP_NAME.split("");

// /**
//  * AnimationStore - класс MobX для централизованного управления анимациями
//  */

// logger.debug("check");

// class AnimationStore {
//   appNameIsHover = false;
//   mantineControlAnimations = {};
//   springAnimations = {};
//   requestAnimationFrame;

//   themeController;
//   animations = {};
//   animations = new Map();

//   // get getAppNameArray() {
//   //   return appNameArray;
//   // }
//   // Настройки
//   settings = {
//     ultraSpring: {
//       tension: 50,
//       friction: 75,
//       mass: 5,
//       damping: 100,
//       precision: 0.0001,
//     },
//     defaultEasing: {
//       tension: 280,
//       friction: 60,
//       mass: 1,
//     },
//     adaptivePerformance: true,
//     resourceSaving: true,
//     metrics: {
//       enabled: true,
//       sampleSize: 30,
//     },
//   };
//   // Метрики производительности
//   metrics = {
//     jankFrames: 0,
//     smoothFrames: 0,
//     totalFrames: 0,
//     get jankPercentage() {
//       return this.totalFrames ? (this.jankFrames / this.totalFrames) * 100 : 0;
//     },
//     lastFrameDuration: 0,
//     avgFrameDuration: 0,
//   };
//   // Таймер
//   timerStore = null;

//   constructor() {
//     makeAutoObservable(this, {
//       mantineControlAnimations: observable.ref,
//       springAnimations: observable.ref,
//       themeController: observable.ref,
//       setMantineControlAnimation: action,
//       setSpringAnimation: action,
//       setAppNameIsHover: action,
//       pageAnimation: false,
//       animations: false,
//       timerStore: false,
//       rafzCoordinator: false,
//     });
//     logger.warning("warning");
//     this.themeController = new Controller({
//       ...gradientStore.getTheme,
//       onRest: () => {
//         console.log("Theme animation completed");
//         logger.warning("success");
//       },
//     });

//     // requestAnimationFrame: (cb) => setTimeout(cb, 1000 / 60),
//     // this.setupPerformanceMode();

//     Globals.assign({
//       skipAnimation: false,
//       frameLoop: "always",
//       defaultResetProp: true,
//     });

//     // Инициализация всех анимаций
//     // this.setupPageAnimation();

//     // this.setupReactions();

//     // this.timerStore = engine;

//     // Используем rafz координатор
//     // this.rafzCoordinator = rafzCoordinator;

//     // Настраиваем интеграцию с глобальным таймером и rafz
//     // this.setupRafzIntegration();

//     // Настраиваем обнаружение производительности устройства
//     // this.detectDeviceCapabilities();
//   }

//   get getAppNameArray() {
//     return (
//       // uiStore.screenSize.width + 'x' + uiStore.screenSize.height + "__"+
//       (
//         windowStore.width +
//         "x" +
//         windowStore.height +
//         "__" +
//         gpuStore.currentMode?.width +
//         "x" +
//         gpuStore.currentMode?.height
//       ).split("")
//     );
//   }

//   get getAppNameIsHover() {
//     return this.appNameIsHover;
//   }

//   get animatedTheme() {
//     return { ...this.themeController.springs };
//   }

//   get theme() {
//     return { ...gradientStore.getTheme };
//   }

//   setupPerformanceMode() {
//     // Определение высокопроизводительных устройств
//     const isHighPerformanceDevice =
//       window.devicePixelRatio >= 2 && navigator.hardwareConcurrency > 4;

//     // Настройка глобальных параметров анимации
//     // if (!isHighPerformanceDevice) {
//     //   // Для низкопроизводительных устройств
//     //   Globals.assign({
//     //     frameLoop: "demand", // Анимировать только при необходимости
//     //     preferRedraw: false, // Избегать лишних перерисовок
//     //   });
//     //
//     //   // Более простые конфигурации
//     //   this.lowPerformanceConfig = {
//     //     tension: 300,
//     //     friction: 30,
//     //     clamp: true, // Предотвратить колебания
//     //   };
//     // }
//     // createOptimizedSpring(initialValue, property);
//     // {
//     //   const spring = new SpringValue(initialValue);
//     //
//     //   // Применение конфигурации в зависимости от производительности
//     //   if (this.lowPerformanceConfig) {
//     //     spring.options.config = this.lowPerformanceConfig;
//     //   } else {
//     //     // Оптимизированная конфигурация для разных свойств
//     //     if (property === "opacity" || property === "scale") {
//     //       spring.options.config = { tension: 400, friction: 20 }; // Быстрее для визуального отклика
//     //     } else if (property === "x" || property === "y") {
//     //       spring.options.config = { tension: 350, friction: 35 }; // Более плавно для позиционирования
//     //     }
//     //   }
//     //
//     //   return spring;
//     // }
//   }

//   setAppNameIsHover = (isHover) => (this.appNameIsHover = isHover);


//   //
//   // // Улучшенная анимация с последовательностью
//   // // async animatePageOnNavbarChange(isOpened) {
//   // //   if (isOpened) {
//   // //     // Последовательная анимация при открытии
//   // //     await this.pageAnimation.x.start(250);
//   // //     await Promise.all([
//   // //       this.pageAnimation.scale.start(1),
//   // //       this.pageAnimation.y.start(50),
//   // //     ]);
//   //   // } else {
//   //   //   // Параллельная анимация при закрытии
//   //   //   await Promise.all([
//   //   //     this.pageAnimation.x.start(225),
//   //   //     this.pageAnimation.scale.start(1.7),
//   //   //     this.pageAnimation.y.start(-50),
//   //   //   ]);
//   //   }

//   setupPageAnimation(isNavbarOpened) {
//     return true;
//   }

//   // Используем async/await для последовательной анимации
//   // const animate = async () => {
//   //   if (isNavbarOpened) {
//   //     // Анимируем x сначала
//   //     await this.pageAnimation.x.start(250);
//   //     // Затем scale и y одновременно
//   //     await Promise.all([
//   //       this.pageAnimation.scale.start(1),
//   //       this.pageAnimation.y.start(50),
//   //     ]);
//   //   } else {
//   //     // Анимируем все свойства одновременно при закрытии
//   //     await Promise.all([
//   //       this.pageAnimation.x.start(225),
//   //       this.pageAnimation.scale.start(1.7),
//   //       this.pageAnimation.y.start(-50),
//   //     ]);
//   //   }
//   // };
//   //
//   // animate();

//   // Более тонкое управление анимациями
//   // pauseAllAnimations() {
//   //   Object.values(this.pageAnimation).forEach((spring) => spring.pause());
//   //   Object.values(this.navbarAnimation).forEach((spring) => spring.pause());
//   //   // Другие анимации...
//   // }
//   //
//   // resumeAllAnimations() {
//   //   Object.values(this.pageAnimation).forEach((spring) => spring.resume());
//   //   Object.values(this.navbarAnimation).forEach((spring) => spring.resume());
//   //   // Другие анимации...
//   // }

//   // Динамическое изменение конфигурации
//   // setAnimationSpeed(speed = 1) {
//   //   // Коэффициент скорости (0.5 = медленнее, 2 = быстрее)
//   //   const baseConfig = { tension: 400, friction: 220, mass: 225 };
//   //   const newConfig = {
//   //     tension: baseConfig.tension * speed,
//   //     friction: baseConfig.friction,
//   //     mass: baseConfig.mass / speed,
//   //   };
//   //
//   //   // Применить новую конфигурацию ко всем анимациям
//   //   Object.values(this.pageAnimation).forEach(
//   //     (spring) => (spring.options.config = newConfig),
//   //   );
//   // }

//   // setupPageAnimation() {
//   //   // Использование отдельных SpringValue для каждого свойства
//   //   this.pageAnimation = {
//   //     x: new SpringValue(225),
//   //     y: new SpringValue(-50),
//   //     scale: new SpringValue(1.7),
//   //   };

//   // Конфигурация из JSON
//   // const config = { tension: 400, friction: 220, mass: 225 };
//   // Object.values(this.pageAnimation).forEach(
//   //   (spring) => (spring.options.config = config),
//   // );
// }

// // Методы для компонентов
// // getPageAnimationValues() {
// //   return {
// //     x: this.pageAnimation.x.get(),
// //     y: this.pageAnimation.y.get(),
// //     scale: this.pageAnimation.scale.get(),
// //   };
// // }
// //
// // getThemeValues() {
// //   return this.themeController.springs;
// // }
// //
// // // Расширенные методы управления
// // setAnimationSpeed(speed = 1) {
// //   const baseConfig = { tension: 400, friction: 220, mass: 225 };
// //   const newConfig = {
// //     tension: baseConfig.tension * speed,
// //     friction: baseConfig.friction,
// //     mass: baseConfig.mass / speed,
// //   };
// //
// //   Object.values(this.pageAnimation).forEach(
// //     (spring) => (spring.options.config = newConfig),
// //   );
// // }
// //
// // pauseAllAnimations() {
// //   Object.values(this.pageAnimation).forEach((spring) => spring.pause());
// // }
// //
// // resumeAllAnimations() {
// //   Object.values(this.pageAnimation).forEach((spring) => spring.resume());
// // }

// /**
//  * Инициализация анимаций и подписка на изменения состояния
//  */
// // initAnimations() {
// // Инициализация анимации страницы при открытии/закрытии навбара
// // this.initPageWithNavBarAnimation();

// // Другие анимации могут быть добавлены здесь
// // }

// /**
//  * Инициализация анимации страницы при открытии/закрытии навбара
//  */
// // initPageWithNavBarAnimation() {
// //   try {
// //     // Импортируем параметры анимации
// //
// //     const { x, y, scale, config } = params;
// //
// //     // Создаем spring анимацию
// //     const spring = new SpringValue({
// //       from: {
// //         x: x[0],
// //         y: y[0],
// //         scale: scale[0],
// //       },
// //       to: {
// //         x: x[0],
// //         y: y[0],
// //         scale: scale[0],
// //       },
// //       config,
// //     });

// // Сохраняем анимацию
// //     this.animations.pageWithNavBar = spring;
// //
// //     // Создаем реакцию на изменение состояния навбара
// //     reaction(
// //       () => uiStore.isNavbarOpened,
// //       (isOpened) => {
// //         spring.start({
// //           to: {
// //             x: x[isOpened ? 1 : 0],
// //             y: y[isOpened ? 1 : 0],
// //             scale: scale[isOpened ? 1 : 0],
// //           },
// //         });
// //       },
// //       { fireImmediately: true },
// //     );
// //   } catch (error) {
// //     console.error("Error initializing pageWithNavBar animation:", error);
// //   }
// // }

// /**
//  * Получение текущих значений анимации
//  * @param {string} animationName - имя анимации
//  * @returns {Object} - текущие значения анимации или пустой объект
//  */
// // getAnimationValues(animationName) {
// //   const animation = this.animations[animationName];
// //   if (!animation) {
// //     console.warn(`Animation "${animationName}" not found`);
// //     return {};
// //   }
// //
// //   return animation.get();
// // }

// /**
//  * Получение текущих значений анимации страницы с навбаром
//  * @returns {Object} - текущие значения анимации
//  */
// // getPageWithNavBarValues() {
// //   return this.getAnimationValues("pageWithNavBar");
// // }

// /**
//  * Настраивает интеграцию с timerStore для всех анимаций
//  */
// // setupTimerIntegration() {
// //   // Проверяем доступность движка
// //   if (!this.timerStore) {
// //     console.warn(
// //       "Animation engine not found, using native requestAnimationFrame",
// //     );
// //     return;
// //   }
// //
// //   // Регистрируем обработчик кадра
// //   this.timerStore.registerRenderCallback(
// //     "animation-core",
// //     (frameId, deltaTime) => {
// //       this.processFrame(deltaTime);
// //     },
// //   );
// //
// //   // Заменяем глобальные функции React Spring
// //   const originalRAF = Globals.requestAnimationFrame;
// //   const originalCAF = Globals.cancelAnimationFrame;
// //
// //   Globals.requestAnimationFrame = (callback) => {
// //     return this.timerStore.nextFrame(callback);
// //   };
// //
// //   Globals.cancelAnimationFrame = (id) => {
// //     // В нашем движке нет прямого метода отмены кадра,
// //     // но мы можем убрать коллбэк из списка
// //     if (originalCAF) originalCAF(id);
// //   };
// //
// //   // Сохраняем оригинальные функции для возможного восстановления
// //   this._originalRAF = originalRAF;
// //   this._originalCAF = originalCAF;
// // }

// /**
//  * Определяет возможности устройства и настраивает оптимальные параметры
//  */
// // detectDeviceCapabilities() {
// //   const isLowEndDevice =
// //     (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
// //     window.devicePixelRatio < 1.5;
// //
// //   if (isLowEndDevice && this.settings.adaptivePerformance) {
// //     // Настраиваем для низкопроизводительных устройств
// //     this.settings.defaultEasing = {
// //       tension: 200,
// //       friction: 40,
// //       mass: 1,
// //       clamp: true, // Предотвращаем колебания
// //     };
// //
// //     // Устанавливаем более низкий целевой FPS
// //     if (this.timerStore) {
// //       this.timerStore.setTargetFps(30);
// //     }
// //   }
// // }
// //
// // /**
// //  * Обрабатывает каждый кадр анимации
// //  */
// // processFrame(deltaTime) {
// //   // Обновляем метрики
// //   if (this.settings.metrics.enabled) {
// //     this.updateMetrics(deltaTime);
// //   }
// //
// //   // Адаптивные настройки, если нужно
// //   if (this.settings.adaptivePerformance && this.metrics.jankPercentage > 20) {
// //     // Если много проблемных кадров, временно упрощаем анимации
// //     this.simplifyAnimations();
// //   }
// // }
// // gradientcons;
// /**
//  * Обновляет метрики производительности
//  */
// // updateMetrics(deltaTime) {
// //   runInAction(() => {
// //     // Обновляем счетчики кадров
// //     this.metrics.totalFrames++;
// //
// //     if (deltaTime > 20) {
// //       // > 20ms = < 50fps
// //       this.metrics.jankFrames++;
// //     } else {
// //       this.metrics.smoothFrames++;
// //     }
// //
// //     // Обновляем информацию о времени кадра
// //     this.metrics.lastFrameDuration = deltaTime;
// //     this.metrics.avgFrameDuration =
// //       this.metrics.avgFrameDuration * 0.95 + deltaTime * 0.05;
// //   });
// // }

// /**
//  * Временно упрощает анимации для улучшения производительности
//  */
// // simplifyAnimations() {
// //   // Применяем более простые настройки ко всем активным анимациям
// //   const simplifiedConfig = {
// //     tension: 200,
// //     friction: 30,
// //     clamp: true,
// //   };
// //
// //   this.animations.forEach((animation) => {
// //     if (animation.type === "spring") {
// //       animation.instance.options.config = simplifiedConfig;
// //     } else if (animation.type === "controller") {
// //       animation.instance.configs = {
// //         default: simplifiedConfig,
// //       };
// //     }
// //   });
// // }

// /**
//  * Создает новую изолированную анимацию Spring
//  */
// // createSpring(initialValue, config = {}) {
// //   const id = `spring-${Math.random().toString(36).slice(2)}`;
// //   const spring = new SpringValue(initialValue);
// //
// //   // Применяем конфигурацию
// //   spring.options.config = {
// //     ...this.settings.defaultEasing,
// //     ...config,
// //   };
// //
// //   // Используем rafz для оптимального добавления анимации
// //   raf.write(() => {
// //     // Регистрируем анимацию
// //     this.animations.set(id, {
// //       id,
// //       type: "spring",
// //       instance: spring,
// //       active: true,
// //       visible: true,
// //       created: raf.now(),
// //     });
// //   });
// //
// //   return {
// //     id,
// //     spring,
// //     // Вспомогательные методы
// //     get: () => spring.get(),
// //     set: (value) => spring.set(value),
// //     start: (options) => spring.start(options),
// //     stop: () => spring.pause(),
// //     resume: () => spring.resume(),
// //     // Завершение жизненного цикла
// //     dispose: () => {
// //       spring.stop();
// //       raf.write(() => {
// //         this.animations.delete(id);
// //       });
// //     },
// //   };
// // }

// /**
//  * Создает новый контроллер анимаций
//  */
// // createController(initialValues, config = {}) {
// //   const id = `controller-${Math.random().toString(36).slice(2)}`;
// //   const controller = new Controller(initialValues, {
// //     config: {
// //       ...this.settings.defaultEasing,
// //       ...config.config,
// //     },
// //     ...config,
// //   });
// //
// //   // Используем rafz для оптимального добавления анимации
// //   raf.write(() => {
// //     // Регистрируем анимацию
// //     this.animations.set(id, {
// //       id,
// //       type: "controller",
// //       instance: controller,
// //       active: true,
// //       visible: true,
// //       created: raf.now(),
// //     });
// //   });
// //
// //   return {
// //     id,
// //     controller,
// //     get springs() {
// //       return controller.springs;
// //     },
// //     // Вспомогательные методы
// //     start: (options) => controller.start(options),
// //     stop: () => controller.pause(),
// //     resume: () => controller.resume(),
// //     update: (values) => controller.update(values),
// //     // Завершение жизненного цикла
// //     dispose: () => {
// //       controller.stop();
// //       raf.write(() => {
// //         this.animations.delete(id);
// //       });
// //     },
// //   };
// // }

// /**
//  * Создает связанную с MobX анимацию
//  */
// // createMobXAnimation(store, selector, mapFn, config = {}) {
// //   const animationObj = this.createController(mapFn(selector(store)), config);
// //
// //   // Создаем реакцию MobX
// //   const disposer = reaction(
// //     () => selector(store),
// //     (newValue) => {
// //       animationObj.start(mapFn(newValue));
// //     },
// //     { fireImmediately: false },
// //   );
// //
// //   // Расширяем объект анимации
// //   return {
// //     ...animationObj,
// //     // Переопределяем dispose для очистки реакции
// //     dispose: () => {
// //       disposer();
// //       animationObj.dispose();
// //     },
// //   };
// // }

// /**
//  * Приостанавливает все анимации, которые невидимы
//  */
// // optimizeVisibility(visibilityMap) {
// //   // Используем rafz.write для оптимизации операций с анимациями
// //   raf.write(() => {
// //     this.animations.forEach((animation, id) => {
// //       const shouldBeActive = visibilityMap[id] !== false;
// //
// //       if (animation.active && !shouldBeActive) {
// //         // Приостанавливаем неактивные анимации
// //         if (animation.type === "spring") {
// //           animation.instance.pause();
// //         } else if (animation.type === "controller") {
// //           animation.instance.pause();
// //         }
// //         animation.active = false;
// //       } else if (!animation.active && shouldBeActive) {
// //         // Возобновляем активные анимации
// //         if (animation.type === "spring") {
// //           animation.instance.resume();
// //         } else if (animation.type === "controller") {
// //           animation.instance.resume();
// //         }
// //         animation.active = true;
// //       }
// //     });
// //   });
// // }

// /**
//  * Настраивает общие параметры анимационного движка
//  */
// // configure(settings = {}) {
// //   Object.assign(this.settings, settings);
// //
// //   // Применяем изменения настроек
// //   if (settings.adaptivePerformance !== undefined) {
// //     this.detectDeviceCapabilities();
// //   }
// //
// //   // Настраиваем rafz координатор, если указаны связанные настройки
// //   if (
// //     settings.frameLoop !== undefined ||
// //     settings.batchUpdates !== undefined
// //   ) {
// //     this.rafzCoordinator.configure({
// //       frameLoop: settings.frameLoop,
// //       batchUpdates: settings.batchUpdates !== false,
// //       useEngineIntegration: this.settings.useEngineIntegration !== false,
// //     });
// //   }
// // }

// /**
//  * Создает функцию с ограничением частоты вызова (не чаще одного раза за кадр)
//  */
// // throttle(fn) {
// //   return this.rafzCoordinator.throttle(fn);
// // }

// /**
//  * Устанавливает таймаут, который выполнится на ближайшем кадре
//  */
// // setTimeout(callback, ms) {
// //   return this.rafzCoordinator.setTimeout(callback, ms);
// // }

// /**
//  * Выполняет функцию синхронно (без планирования)
//  */
// // sync(fn) {
// //   this.rafzCoordinator.sync(fn);
// // }

// /**
//  * Регистрирует обработчик для выполнения на определенной фазе кадра
//  */
// // onFrame(id, callback) {
// //   return this.rafzCoordinator.register(id, callback, "frame");
// // }

// /**
//  * Регистрирует обработчик для выполнения перед началом кадра
//  */
// // onStart(id, callback) {
// //   return this.rafzCoordinator.register(id, callback, "start");
// // }

// /**
//  * Регистрирует обработчик для выполнения после завершения кадра
//  */
// // onFinish(id, callback) {
// //   return this.rafzCoordinator.register(id, callback, "finish");
// // }

// /**
//  * Создает группу связанных анимаций с возможностью цепочки
//  */
// // createAnimationChain(animationsConfig) {
// //   const refs = {};
// //   const animations = {};
// //   const controllers = {};
// //
// //   // Создаем все анимации и их контроллеры
// //   Object.entries(animationsConfig).forEach(([name, config]) => {
// //     refs[name] = { current: null };
// //     controllers[name] = this.createController(
// //       config.initial || {},
// //       config.config || {},
// //     );
// //     animations[name] = controllers[name].springs;
// //   });
// //
// //   // Метод для запуска цепочки анимаций
// //   const runChain = async (sequence = [], options = {}) => {
// //     const { delay = 0 } = options;
// //
// //     // Задержка перед началом цепочки
// //     if (delay > 0) {
// //       await new Promise((resolve) => setTimeout(resolve, delay));
// //     }
// //
// //     // Запускаем анимации последовательно
// //     for (const step of sequence) {
// //       if (typeof step === "string") {
// //         // Простой шаг - запускаем анимацию по имени
// //         if (controllers[step]) {
// //           await controllers[step].start(animationsConfig[step].animate || {});
// //         }
// //       } else if (typeof step === "object") {
// //         // Сложный шаг с параметрами
// //         const { name, target, delay: stepDelay = 0, parallel = [] } = step;
// //
// //         // Задержка перед шагом
// //         if (stepDelay > 0) {
// //           await new Promise((resolve) => setTimeout(resolve, stepDelay));
// //         }
// //
// //         // Запускаем основную анимацию
// //         const mainPromise = controllers[name]?.start(
// //           target || animationsConfig[name].animate || {},
// //         );
// //
// //         // Запускаем параллельные анимации
// //         const parallelPromises = parallel.map((parallelName) =>
// //           controllers[parallelName]?.start(
// //             animationsConfig[parallelName].animate || {},
// //           ),
// //         );
// //
// //         // Ждем завершения всех параллельных анимаций
// //         await Promise.all([mainPromise, ...parallelPromises].filter(Boolean));
// //       }
// //     }
// //   };
// //
// //   return {
// //     animations,
// //     controllers,
// //     runChain,
// //     // Завершение жизненного цикла
// //     dispose: () => {
// //       Object.values(controllers).forEach((controller) =>
// //         controller.dispose(),
// //       );
// //     },
// //   };
// // }

// /**
//  * Упрощенный API для одиночных анимаций без создания хуков
//  */
// // spring(initialValue, config = {}) {
// //   return this.createSpring(initialValue, config).spring;
// // }
// //
// // controller(initialValues, config = {}) {
// //   return this.createController(initialValues, config).controller;
// // }

// export const animation = new AnimationStore();
