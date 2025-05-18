import seconds from "@stores/seconds";
import { observer } from "mobx-react-lite";

// Компонент, использующий таймер
export const Seconds = observer(() => {
  return (
    <div>
      <div>Время: {seconds.formattedTime}</div>
      <button onClick={() => seconds.start()}>Старт</button>
      <button onClick={() => seconds.stop()}>Стоп</button>
      <button onClick={() => seconds.reset()}>Сброс</button>
      <select
        value={seconds.precision}
        onChange={(e) => seconds.setPrecision(Number(e.target.value))}
      >
        <option value="10">Очень высокая (0.01с)</option>
        <option value="100">Высокая (0.1с)</option>
        <option value="1000">Стандартная (1с)</option>
      </select>
    </div>
  );
});
