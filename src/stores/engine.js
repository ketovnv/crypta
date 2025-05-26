import { makeAutoObservable, action, observable, computed } from "mobx";
import { useEffect, useRef } from "react";
import { motionValue } from "motion/react";

const useFramerMotionSync = (
  animationControls,
  options = { forceUpdateInNonVSyncOnly: true },
) => {
  const componentId = useRef(`framer-${Math.random()}`).current;

  useEffect(() => {
    const updateCallback = (frameId, deltaTime, elapsedTime) => {
      if (timerStore._vsyncEnabled && options.forceUpdateInNonVSyncOnly) {
        // В режиме VSync, возможно, не нужно принудительно вызывать update,
        // если только не передавать deltaTime/elapsedTime для специфичных нужд.
        // Например, можно передать deltaTime в кастомное свойство анимации, если это требуется.
        // animationControls.set({ customDeltaTime: deltaTime }); // Если Framer Motion это поддерживает напрямую
        return;
      }
      // В режиме Non-VSync или если forceUpdateInNonVSyncOnly = false
      if (animationControls && typeof animationControls.update === "function") {
        animationControls.update();
      }
    };

    timerStore.registerRenderCallback(componentId, updateCallback);

    // Убедимся, что таймер запущен (если это политика по умолчанию для этих хуков)
    // Возможно, запуск таймера лучше оставить на усмотрение приложения, а не каждого хука.
    if (!timerStore.isRunning) {
      timerStore.setTargetFps(60).start(); // или .disableVSync().start() если это основной режим
    }

    return () => timerStore.unregisterRenderCallback(componentId);
  }, [animationControls, options.forceUpdateInNonVSyncOnly, componentId]); // componentId добавлен для полноты, хотя он и const в рамках рендера
};

class EngineStore {
  // Наблюдаемые значения

  motionElapsedTime = motionValue(0);

  elapsedTime = 0; // в миллисекундах
  isRunning = false;
  precision = 100; // частота обновления в мс (10 раз в секунду)
  // Приватные поля, не являющиеся наблюдаемыми
  _startTime = 0;
  _timerId = null;
  // Наблюдаемые значения

  // FPS счетчик и ограничитель
  fps = 0;
  targetFps = 60; // целевое количество кадров в секунду
  frameCount = 0;
  lastFpsUpdateTime = 0;
  fpsUpdateInterval = 1000; // Обновлять FPS каждую секунду
  // Управление рендерингом
  frameId = 0; // Идентификатор текущего кадра (инкрементируется с каждым тиком)
  renderCallbacks = new Map(); // Коллекция callback-функций для внешних компонентов
  // Приватные поля, не являющиеся наблюдаемыми

  _lastFrameTime = 0;
  _frameTimings = []; // хранит время между кадрами для расчета FPS
  _nextFrameCallbacks = []; // одноразовые колбэки для следующего кадра
  _vsyncEnabled = true; // синхронизация с VSync (requestAnimationFrame)

  constructor() {
    // Делаем свойства наблюдаемыми автоматически
    makeAutoObservable(this, {
      // Явно указываем какие свойства являются наблюдаемыми
      elapsedTime: observable,
      isRunning: observable,
      precision: observable,
      fps: observable,
      targetFps: observable,
      frameId: observable,
      timeScale: observable,
      setTimeScale: action,

      // Computed свойства
      averageFrameTime: computed,

      // Методы, изменяющие состояние, помечаем как действия
      start: action,
      stop: action,
      reset: action,
      setPrecision: action,
      setTargetFps: action,
      registerRenderCallback: action,
      unregisterRenderCallback: action,
      nextFrame: action,
      enableVSync: action,
      disableVSync: action,
      _tick: action,
      _updateFps: action,
      _limitFrameRate: action,
    });
    this.motionElapsedTime = motionValue(0);
  }

  get seconds() {
    return this.elapsedTime / 1000;
  }

  get formattedTime() {
    const totalSeconds = Math.floor(this.elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((this.elapsedTime % 1000) / 10);

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  }

  // Геттер для получения среднего времени кадра (в мс)
  get averageFrameTime() {
    if (this._frameTimings.length === 0) return 0;

    const sum = this._frameTimings.reduce((acc, time) => acc + time, 0);
    return sum / this._frameTimings.length;
  }

  // Начать отсчет времени

  // Геттер для получения минимального FPS (на основе максимального времени кадра)
  get minFps() {
    if (this._frameTimings.length === 0) return 0;

    const maxFrameTime = Math.max(...this._frameTimings);
    return maxFrameTime > 0 ? Math.round(1000 / maxFrameTime) : 0;
  }

  // Геттер для получения максимального FPS (на основе минимального времени кадра)
  get maxFps() {
    if (this._frameTimings.length === 0) return 0;

    const minFrameTime = Math.min(...this._frameTimings);
    return minFrameTime > 0 ? Math.round(1000 / minFrameTime) : 0;
  }

  // Получить статистику производительности
  get performanceStats() {
    return {
      fps: this.fps,
      averageFrameTime: this.averageFrameTime.toFixed(2),
      minFps: this.minFps,
      maxFps: this.maxFps,
      frameTimings: [...this._frameTimings],
    };
  }

  setPrecision = (ms) => {
    const wasRunning = this.isRunning;

    if (wasRunning) {
      this.stop();
    }

    this.precision = ms;

    if (wasRunning) {
      this.start();
    }

    return this; // Для цепочки вызовов
  };

  // Начать отсчет времени
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this._startTime = Date.now() - this.elapsedTime;
    this._lastFrameTime = Date.now();
    this.lastFpsUpdateTime = Date.now();

    // Если используем requestAnimationFrame (VSync режим)
    if (this._vsyncEnabled) {
      const frameCallback = () => {
        this._tick();
        if (this.isRunning) {
          this._timerId = requestAnimationFrame(frameCallback);
        }
      };
      this._timerId = requestAnimationFrame(frameCallback);
    }
    // Если используем таймер с заданной частотой (без VSync)
    else {
      // Вычисляем интервал на основе целевого FPS
      const interval = 1000 / this.targetFps;
      this._timerId = setInterval(() => this._tick(), interval);
    }
  }

  // Остановить таймер
  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this._vsyncEnabled) {
      cancelAnimationFrame(this._timerId);
    } else {
      clearInterval(this._timerId);
    }
    this._timerId = null;
    this._frameTimings = []; // Очищаем данные о кадрах при остановке

    return this; // Для цепочки вызовов
  }

  // Сбросить таймер

  // Получить текущее время в разных форматах

  // Зарегистрировать callback, который будет вызываться на каждом кадре
  registerRenderCallback(id, callback) {
    if (typeof callback !== "function") {
      console.error("Callback must be a function");
      return this;
    }

    this.renderCallbacks.set(id, callback);
    return this; // Для цепочки вызовов
  }

  // Удалить зарегистрированный callback
  unregisterRenderCallback(id) {
    this.renderCallbacks.delete(id);
    return this; // Для цепочки вызовов
  }

  // Добавить одноразовый callback для следующего кадра (аналог requestAnimationFrame)
  nextFrame(callback) {
    if (typeof callback !== "function") {
      console.error("Callback must be a function");
      return -1;
    }

    this._nextFrameCallbacks.push(callback);

    // Если таймер не запущен, но нужно выполнить анимацию,
    // запускаем одноразовый requestAnimationFrame
    if (!this.isRunning) {
      requestAnimationFrame(() => {
        const now = Date.now();
        const frameTime = now - this._lastFrameTime;
        this._lastFrameTime = now;

        // Вызываем только одноразовые колбэки
        const callbacks = [...this._nextFrameCallbacks];
        this._nextFrameCallbacks = [];

        callbacks.forEach((cb) => {
          try {
            cb(this.frameId, frameTime);
          } catch (e) {
            console.error("Error in animation callback:", e);
          }
        });

        this.frameId++;
      });
    }

    return this.frameId + 1; // Возвращаем ID следующего кадра
  }

  // Контролировать частоту кадров (для режима без VSync)
  _limitFrameRate(targetFps) {
    const now = Date.now();
    const elapsed = now - this._lastFrameTime;
    const targetFrameTime = 1000 / targetFps;

    // Если прошло меньше времени, чем нужно для поддержания целевого FPS,
    // пропускаем обновление
    return elapsed >= targetFrameTime;
  }

  // Приватный метод для обновления времени
  _tick() {
    if (!this.isRunning) return;

    const now = Date.now();

    // В режиме без VSync проверяем, нужно ли пропустить кадр для соблюдения частоты
    if (!this._vsyncEnabled && !this._limitFrameRate(this.targetFps)) {
      return;
    }

    // Обновляем счетчик времени
    this.elapsedTime = now - this._startTime;

    // Увеличиваем счетчик кадров и ID текущего кадра
    this.frameCount++;
    this.frameId++;

    // Вычисляем время между кадрами
    const frameTime = now - this._lastFrameTime;
    this._lastFrameTime = now;

    // Сохраняем информацию о времени между кадрами (для скользящего среднего)
    this._frameTimings.push(frameTime);
    if (this._frameTimings.length > 60) {
      // Хранить данные только для последних 60 кадров
      this._frameTimings.shift();
    }
    this.motionElapsedTime.set(this.elapsedTime);
    // Обновляем FPS каждую секунду
    if (now - this.lastFpsUpdateTime >= this.fpsUpdateInterval) {
      this._updateFps();
    }

    // Выполняем все зарегистрированные колбэки рендеринга
    this.renderCallbacks.forEach((callback, id) => {
      try {
        callback(this.frameId, frameTime);
      } catch (e) {
        console.error(`Error in render callback (id: ${id}):`, e);
      }
    });

    // Выполняем одноразовые колбэки
    const nextFrameCallbacks = [...this._nextFrameCallbacks];
    this._nextFrameCallbacks = [];

    nextFrameCallbacks.forEach((callback) => {
      try {
        callback(this.frameId, frameTime);
      } catch (e) {
        console.error("Error in next frame callback:", e);
      }
    });
  }

  // Обновить значение FPS
  _updateFps() {
    const now = Date.now();
    const elapsed = now - this.lastFpsUpdateTime;

    if (elapsed > 0) {
      // Вычисляем FPS на основе количества кадров за прошедшее время
      this.fps = Math.round((this.frameCount * 1000) / elapsed);

      // Сбрасываем счетчики
      this.frameCount = 0;
      this.lastFpsUpdateTime = now;
    }
  }

  setTargetFps(fps) {
    if (fps < 1) fps = 1; // Минимальный FPS - 1 кадр в секунду
    if (fps > 240) fps = 240; // Максимальный FPS - 240 кадров в секунду

    const wasRunning = this.isRunning;

    if (wasRunning && !this._vsyncEnabled) {
      this.stop();
    }

    this.targetFps = fps;

    if (wasRunning && !this._vsyncEnabled) {
      this.start();
    }

    return this; // Для цепочки вызовов
  }

  // Сбросить таймер
  reset() {
    this.stop();
    this.elapsedTime = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.frameId = 0;
    this._frameTimings = [];
    this._nextFrameCallbacks = [];

    return this; // Для цепочки вызовов
  }

  enableVSync() {
    if (this._vsyncEnabled) return this;

    const wasRunning = this.isRunning;

    if (wasRunning) {
      this.stop();
    }

    this._vsyncEnabled = true;

    if (wasRunning) {
      this.start();
    }

    return this; // Для цепочки вызовов
  }

  @action
  setTimeScale(scale) {
    if (scale < 0) scale = 0; // Отрицательное время обычно не используется для простого масштабирования
    this.timeScale = scale;
    // Если таймер запущен и не используется VSync, возможно, потребуется перезапустить интервал,
    // если deltaTime влияет на расчет интервала (хотя обычно timeScale влияет на *использование* deltaTime).
    // В данном случае, он будет влиять на deltaTime, передаваемый в колбэки.
    return this;
  }

  _tick() {
    if (!this.isRunning) return;

    const now = Date.now();

    if (!this._vsyncEnabled && !this._limitFrameRate(this.targetFps)) {
      return;
    }

    // Обновляем elapsedTime с учетом timeScale только если startTime используется как база.
    // Если elapsedTime инкрементально обновляется, то deltaTime нужно масштабировать.
    // this.elapsedTime = now - this._startTime; // Этот способ не учитывает timeScale напрямую для общей суммы,
    // timeScale лучше применять к deltaTime.

    const actualDeltaTime = now - this._lastFrameTime;
    const scaledDeltaTime = actualDeltaTime * this.timeScale;

    // Обновляем общее прошедшее время (масштабированное)
    // Если this.elapsedTime должно отражать "реальное" прошедшее время, а масштабирование только для анимаций,
    // то this.elapsedTime не меняем, а scaledDeltaTime передаем в колбэки.
    // Если this.elapsedTime должно отражать "игровое" или "анимационное" время:
    this.elapsedTime += scaledDeltaTime; // Если elapsedTime инкрементируется

    // Если this.elapsedTime считается от _startTime, то _startTime нужно корректировать при изменении timeScale или при паузе,
    // чтобы elapsedTime отражало масштабированное течение времени.
    // Проще всего обновлять elapsedTime инкрементально с scaledDeltaTime, если оно используется как "анимационное время".
    // Давайте предположим, что elapsedTime = это общее "виртуальное" время анимации.
    // При старте: this.elapsedTime = 0 (или сохраненное); this._startTime = Date.now(); this._lastFrameTime = now;
    // В _tick:
    // this.elapsedTime = (Date.now() - this._startTime) * this.timeScale; // Это неверно, т.к. _startTime не меняется с timeScale.
    // Правильнее так:
    // this.elapsedTime += scaledDeltaTime; (при старте elapsedTime = 0 или сохраненное значение)

    this._lastFrameTime = now;
    this.frameCount++;
    this.frameId++;

    // ... (обновление FPS) ...

    // Выполняем все зарегистрированные колбэки рендеринга, передавая scaledDeltaTime
    this.renderCallbacks.forEach((callback, id) => {
      try {
        // Передаем frameId, масштабированное deltaTime и текущее масштабированное elapsedTime
        callback(this.frameId, scaledDeltaTime, this.elapsedTime);
      } catch (e) {
        console.error(`Error in render callback (id: ${id}):`, e);
      }
    });

    // ... (одноразовые колбэки, также передаем scaledDeltaTime)
    nextFrameCallbacks.forEach((callback) => {
      try {
        callback(this.frameId, scaledDeltaTime, this.elapsedTime);
      } catch (e) {
        // ...
      }
    });
  }

  // При старте таймера, если elapsedTime накапливается:
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    // this._startTime = Date.now() - this.elapsedTime; // Если elapsedTime - реальное время
    // Если elapsedTime - это виртуальное время, и оно накапливается:
    if (this.elapsedTime === 0) {
      // Или если сбрасывалось
      this._startTime = Date.now(); // Для расчета общего реального времени если нужно
    }
    this._lastFrameTime = Date.now();
    // ... остальная логика start ...
  }

  reset() {
    this.stop();
    this.elapsedTime = 0;
    this.timeScale = 1.0; // Сбрасываем и timeScale
    // ... остальная логика reset ...
    return this;
  }

  // Приватный метод для обновления времени

  disableVSync() {
    if (!this._vsyncEnabled) return this;

    const wasRunning = this.isRunning;

    if (wasRunning) {
      this.stop();
    }

    this._vsyncEnabled = false;

    if (wasRunning) {
      this.start();
    }

    return this; // Для цепочки вызовов
  }
}

// Создаем и экспортируем экземпляр хранилища
const engine = new EngineStore();
export default engine;

// Пример использования:
/*
 import timerStore from './timerStore';
 import { observer } from 'mobx-react-lite';

 // Компонент, использующий таймер
 const TimerComponent = observer(() => {
 return (
 <div>
 <div>Время: {timerStore.formattedTime}</div>
 <button onClick={() => timerStore.start()}>Старт</button>
 <button onClick={() => timerStore.stop()}>Стоп</button>
 <button onClick={() => timerStore.reset()}>Сброс</button>
 <select
 value={timerStore.precision}
 onChange={(e) => timerStore.setPrecision(Number(e.target.value))}
 >
 <option value="10">Очень высокая (0.01с)</option>
 <option value="100">Высокая (0.1с)</option>
 <option value="1000">Стандартная (1с)</option>
 </select>
 </div>
 );
 });
 */
