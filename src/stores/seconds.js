import { makeAutoObservable, action, observable } from "mobx";

class TimerStore {
  // Наблюдаемые значения
  elapsedTime = 0; // в миллисекундах
  isRunning = false;
  precision = 1000; // частота обновления в мс (10 раз в секунду)

  // Приватные поля, не являющиеся наблюдаемыми
  _startTime = 0;
  _timerId = null;
  items = [];
  selectedIndex = -1;

  constructor() {
    // Делаем свойства наблюдаемыми автоматически
    makeAutoObservable(this, {
      // Явно указываем какие свойства являются наблюдаемыми
      elapsedTime: observable,
      isRunning: observable,
      precision: observable,

      // Методы, изменяющие состояние, помечаем как действия
      start: action,
      stop: action,
      reset: action,
      setPrecision: action,
      _tick: action,
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

  // Начать отсчет времени
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this._startTime = Date.now() - this.elapsedTime;

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
  }

  // Сбросить таймер
  reset() {
    this.stop();
    this.elapsedTime = 0;
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

    this.elapsedTime = Date.now() - this._startTime;
  }
}

// Создаем и экспортируем экземпляр хранилища
const seconds = new TimerStore();
export default seconds;

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
