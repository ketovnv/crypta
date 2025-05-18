import { makeAutoObservable, action, observable, computed } from "mobx";

class EngineStore {
  // Наблюдаемые значения
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
