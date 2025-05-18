import time from "@stores/time";
import { observer } from "mobx-react-lite";

// Компонент, использующий таймер и FPS-счетчик
export const Time = observer(() => {
  return (
    <div>
      <div>Время: {time.formattedTime}</div>
      <div>FPS: {time.fps}</div>
      <div>Среднее время кадра: {time.averageFrameTime.toFixed(2)} мс</div>
      <div>
        Мин. FPS: {time.minFps} / Макс. FPS: {time.maxFps}
      </div>

      <button onClick={() => time.start()}>Старт</button>
      <button onClick={() => time.stop()}>Стоп</button>
      <button onClick={() => time.reset()}>Сброс</button>
      <select
        value={time.precision}
        onChange={(e) => time.setPrecision(Number(e.target.value))}
      >
        <option value="10">Очень высокая (0.01с)</option>
        <option value="100">Высокая (0.1с)</option>
        <option value="1000">Стандартная (1с)</option>
      </select>
    </div>
  );
});
