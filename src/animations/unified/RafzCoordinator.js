import { raf } from "@react-spring/rafz";
import { Globals } from "@react-spring/web";
import engine from "@stores/engine";

/**
 * Координатор анимационных фреймов, использующий @react-spring/rafz
 * для эффективной координации всех анимаций в приложении
 */
class RafzCoordinator {
  constructor() {
    // Состояние координатора
    this.isActive = false;
    this.integrationEnabled = false;
    this.frameCallbacks = new Map();
    this.frameId = 0;
    this.lastTime = 0;

    // Настройки
    this.settings = {
      useEngineIntegration: true, // Использовать интеграцию с engine.js
      frameLoop: "always", // 'always' или 'demand'
      batchUpdates: true, // Группировать обновления
      throttleFrames: false, // Ограничивать частоту кадров
      targetFps: 60, // Целевой FPS при throttleFrames: true
    };

    // Инициализация
    this.init();
  }

  /**
   * Инициализирует координатор
   */
  init() {
    // Настройка raf для постоянной работы
    raf.frameLoop = this.settings.frameLoop;

    // Добавляем обработчики фаз анимации
    this.setupRafHooks();

    // Интеграция с движком анимаций, если он доступен
    if (engine && this.settings.useEngineIntegration) {
      this.setupEngineIntegration();
    }

    // Заменяем глобальные функции React Spring
    this.overrideReactSpringGlobals();
  }

  /**
   * Настраивает хуки для разных фаз анимационного фрейма
   */
  setupRafHooks() {
    // Перед любыми обновлениями
    raf.onStart(() => {
      this.frameId++;
      this.runFramePhase("start");
    });

    // Перед любыми изменениями DOM
    raf.onFrame(() => {
      this.runFramePhase("frame");
    });

    // После всех изменений
    raf.onFinish(() => {
      this.runFramePhase("finish");

      // Сохраняем время последнего кадра
      this.lastTime = raf.now();
    });
  }

  /**
   * Настраивает интеграцию с существующим engine.js
   */
  setupEngineIntegration() {
    this.integrationEnabled = true;

    // Регистрируем основную функцию обновления в engine
    engine.registerRenderCallback("rafz-coordinator", (frameId, deltaTime) => {
      // Используем engine.js для запуска raf вместо нативного requestAnimationFrame
      if (!this.isActive) {
        this.start();
      }

      // Ручной запуск кадра rafz
      raf.advance(deltaTime);
    });

    // Заменяем функцию now в rafz для согласованности времени
    const originalNow = raf.now;
    raf.now = () => {
      return engine.isRunning ? engine.elapsedTime : originalNow();
    };
  }

  /**
   * Заменяет глобальные функции React Spring для использования rafz
   */
  overrideReactSpringGlobals() {
    // Сохраняем оригинальные функции
    const originalRAF = Globals.requestAnimationFrame;
    const originalCAF = Globals.cancelAnimationFrame;

    // Заменяем на функции из rafz
    Globals.requestAnimationFrame = (callback) => {
      return raf((deltaTime) => {
        callback(raf.now());
        return false; // Выполняем только один раз
      });
    };

    Globals.cancelAnimationFrame = (id) => {
      raf.cancel(id);
      if (originalCAF) originalCAF(id);
    };

    // Если доступно пакетное обновление React, используем его
    if (this.settings.batchUpdates && typeof window !== "undefined") {
      // Ищем React DOM для использования его функции пакетного обновления
      const ReactDOM =
        window.ReactDOM ||
        (window.React &&
          window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
            ?.ReactDOM);

      if (ReactDOM && ReactDOM.unstable_batchedUpdates) {
        raf.batchedUpdates = ReactDOM.unstable_batchedUpdates;
      }
    }

    // Сохраняем оригинальные функции для возможного восстановления
    this._originalRAF = originalRAF;
    this._originalCAF = originalCAF;
  }

  /**
   * Запускает координатор анимаций
   */
  start() {
    if (this.isActive) return;

    this.isActive = true;

    // Если не используем интеграцию с engine, запускаем собственный цикл
    if (!this.integrationEnabled) {
      // Запуск непрерывного цикла анимации
      raf(() => {
        // Возвращаем true для непрерывного выполнения
        return true;
      });
    }
  }

  /**
   * Останавливает координатор анимаций
   */
  stop() {
    this.isActive = false;

    // Если не используем интеграцию с engine, останавливаем все активные raf
    if (!this.integrationEnabled) {
      // Нет прямого способа остановить все raf, но можно отменить известные колбэки
      this.frameCallbacks.forEach((callback) => {
        raf.cancel(callback);
      });
    }
  }

  /**
   * Регистрирует колбэк для выполнения на определенной фазе кадра
   * @param {string} id - Уникальный идентификатор колбэка
   * @param {Function} callback - Функция для выполнения
   * @param {string} phase - Фаза кадра ('start', 'frame', 'finish', 'write', 'update')
   * @returns {string} - Идентификатор колбэка
   */
  register(id, callback, phase = "update") {
    const callbackId = id || `callback-${Math.random().toString(36).slice(2)}`;

    // Создаем обертку для колбэка, которая выполнится в нужной фазе
    const wrappedCallback = (dt) => {
      // Вызываем оригинальный колбэк с временем кадра
      return callback(this.frameId, dt);
    };

    // Сохраняем колбэк для возможной отмены
    this.frameCallbacks.set(callbackId, wrappedCallback);

    // Регистрируем колбэк в зависимости от фазы
    switch (phase) {
      case "write":
        raf.write(wrappedCallback);
        break;
      case "start":
        raf.onStart(wrappedCallback);
        break;
      case "frame":
        raf.onFrame(wrappedCallback);
        break;
      case "finish":
        raf.onFinish(wrappedCallback);
        break;
      case "update":
      default:
        raf(wrappedCallback);
        break;
    }

    // Запускаем координатор, если он еще не активен
    if (!this.isActive) {
      this.start();
    }

    return callbackId;
  }

  /**
   * Отменяет зарегистрированный колбэк
   * @param {string} id - Идентификатор колбэка для отмены
   */
  unregister(id) {
    const callback = this.frameCallbacks.get(id);

    if (callback) {
      raf.cancel(callback);
      this.frameCallbacks.delete(id);
    }
  }

  /**
   * Выполняет все колбэки для указанной фазы кадра
   * @param {string} phase - Фаза кадра
   * @private
   */
  runFramePhase(phase) {
    // Здесь можно добавить дополнительную логику для каждой фазы
    // например, сбор метрик производительности
  }

  /**
   * Создает функцию с ограничением частоты вызова (не чаще одного раза за кадр)
   * @param {Function} fn - Функция для ограничения
   * @returns {Function} - Функция с ограничением частоты вызова
   */
  throttle(fn) {
    return raf.throttle(fn);
  }

  /**
   * Устанавливает таймаут, который выполнится на ближайшем кадре
   * @param {Function} callback - Функция для выполнения
   * @param {number} ms - Время в миллисекундах
   * @returns {number} - Идентификатор таймаута
   */
  setTimeout(callback, ms) {
    return raf.setTimeout(callback, ms);
  }

  /**
   * Устанавливает параметры координатора
   * @param {Object} settings - Новые параметры
   */
  configure(settings = {}) {
    Object.assign(this.settings, settings);

    // Применяем новые настройки
    raf.frameLoop = this.settings.frameLoop;

    // Если изменилась интеграция с engine, перенастраиваем
    if (
      settings.useEngineIntegration !== undefined &&
      settings.useEngineIntegration !== this.settings.useEngineIntegration
    ) {
      if (settings.useEngineIntegration && engine) {
        this.setupEngineIntegration();
      } else {
        this.integrationEnabled = false;
      }
    }
  }

  /**
   * Получает текущее время
   * @returns {number} - Текущее время в миллисекундах
   */
  now() {
    return raf.now();
  }

  /**
   * Выполняет функцию синхронно (без планирования)
   * @param {Function} fn - Функция для выполнения
   */
  sync(fn) {
    raf.sync(fn);
  }

  /**
   * Вручную продвигает анимацию на указанное время
   * @param {number} ms - Время в миллисекундах
   */
  advance(ms) {
    raf.advance(ms);
  }
}

// Создаем единственный экземпляр координатора
export const rafzCoordinator = new RafzCoordinator();

// Экспортируем raf для удобства доступа
export { raf };
