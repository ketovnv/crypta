import { makeAutoObservable, action, observable, computed } from "mobx";

class TimerStore {
  // Наблюдаемые значения
  elapsedTime = 0; // в миллисекундах
  isRunning = false;
  precision = 100; // частота обновления в мс (10 раз в секунду)

  // FPS счетчик
  fps = 0;
  frameCount = 0;
  lastFpsUpdateTime = 0;
  fpsUpdateInterval = 1000; // Обновлять FPS каждую секунду

  // Приватные поля, не являющиеся наблюдаемыми
  _startTime = 0;
  _timerId = null;
  _lastFrameTime = 0;
  _frameTimings = []; // хранит время между кадрами для расчета FPS

  constructor() {
    // Делаем свойства наблюдаемыми автоматически
    makeAutoObservable(this, {
      // Явно указываем какие свойства являются наблюдаемыми
      elapsedTime: observable,
      isRunning: observable,
      precision: observable,
      fps: observable,

      // Computed свойства
      averageFrameTime: computed,

      // Методы, изменяющие состояние, помечаем как действия
      start: action,
      stop: action,
      reset: action,
      setPrecision: action,
      _tick: action,
      _updateFps: action,
    });
  }

  // Получить текущее время в разных форматах
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

  // Начать отсчет времени
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this._startTime = Date.now() - this.elapsedTime;
    this._lastFrameTime = Date.now();
    this.lastFpsUpdateTime = Date.now();

    // Использовать requestAnimationFrame для более точного таймера
    // или setInterval для менее ресурсоемкого варианта
    if (this.precision < 16) {
      // Если нужна высокая точность (больше 60 FPS), используем requestAnimationFrame
      const frameCallback = () => {
        this._tick();
        if (this.isRunning) {
          this._timerId = requestAnimationFrame(frameCallback);
        }
      };
      this._timerId = requestAnimationFrame(frameCallback);
    } else {
      // Иначе используем setInterval для экономии ресурсов
      this._timerId = setInterval(() => this._tick(), this.precision);
    }
  }

  // Остановить таймер
  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.precision < 16) {
      cancelAnimationFrame(this._timerId);
    } else {
      clearInterval(this._timerId);
    }
    this._timerId = null;
    this._frameTimings = []; // Очищаем данные о кадрах при остановке
  }

  // Сбросить таймер
  reset() {
    this.stop();
    this.elapsedTime = 0;
    this.fps = 0;
    this.frameCount = 0;
    this._frameTimings = [];
  }

  // Установить точность отсчета (в миллисекундах)
  setPrecision(ms) {
    const wasRunning = this.isRunning;

    if (wasRunning) {
      this.stop();
    }

    this.precision = ms;

    if (wasRunning) {
      this.start();
    }
  }

  // Приватный метод для обновления времени
  _tick() {
    if (!this.isRunning) return;

    const now = Date.now();
    this.elapsedTime = now - this._startTime;

    // Обновляем FPS счетчик
    this.frameCount++;

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
}

// Создаем и экспортируем экземпляр хранилища
const time = new TimerStore();
export default time;

// Пример использования:
/*
 import timerStore from './timerStore';
 import { observer } from 'mobx-react-lite';

 // Компонент, использующий таймер и FPS-счетчик
 const TimerComponent = observer(() => {
 return (
 <div>
 <div>Время: {timerStore.formattedTime}</div>
 <div>FPS: {timerStore.fps}</div>
 <div>Среднее время кадра: {timerStore.averageFrameTime.toFixed(2)} мс</div>
 <div>Мин. FPS: {timerStore.minFps} / Макс. FPS: {timerStore.maxFps}</div>

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
