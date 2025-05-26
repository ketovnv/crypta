# 🕰️ TimeEngine + RafzCoordinator: Правильное использование

Этот документ описывает правильную интеграцию и примеры использования `AdaptiveTimeEngine` и `RafzCoordinator` в
анимациях с React Spring и MobX. Он поможет избежать зацикливаний, ошибок `frameLoop`, и обеспечит максимальную
производительность.

---

## 🔧 Основные компоненты

### 1. AdaptiveTimeEngine (timeEngine)

Центральный таймер, управляющий логикой времени, FPS, масштабированием времени, и вызовом `raf.advance()` вручную.

#### Методы:

* `start()` / `stop()` — запуск и остановка глобального таймера
* `enableVSync()` / `disableVSync()` — режим VSync или фиксированной частоты
* `setTargetFps(fps)` — установка целевого FPS при `VSync = false`
* `setTimeScale(scale)` — масштаб времени (ускорение/замедление)
* `registerRenderCallback(id, fn)` — регистрация колбэков на каждый кадр
* `unregisterRenderCallback(id)` — удаление колбэка

### 2. RafzCoordinator

Управляет фазами анимации и подменяет поведение `@react-spring/rafz`. Работает **только** в `frameLoop: "demand"`.

#### Особенности:

* НЕ вызывает `raf.advance()` самостоятельно (делает это timeEngine)
* Поддерживает хуки фаз: `onStart`, `onFrame`, `onFinish`
* Синхронизирует время через `raf.now()`
* Подменяет `requestAnimationFrame` глобально

---

## ✅ Принципы правильной работы

1. **Только один источник обновлений** — `timeEngine`
2. **Обязательное указание `frameLoop: "demand"`** везде, где используется `useSpring` или `api.start()`
3. **`rafzCoordinator`** не вызывает `advance`, только обрабатывает фазы

---

## 📦 Примеры

### 🎯 useSpring с ручным loop’ом

```ts
const styles = useSpring({
  from: { opacity: 0 },
  to: { opacity: 1 },
  config: { duration: 1000 },
  frameLoop: "demand"
});
```

### 🧠 useSpringSync (хук синхронизации)

```ts
import { useSpringSync } from "@stores/timeEngine";

const [styles, api] = useSpring(() => ({
  from: { scale: 0 },
  to: { scale: 1 },
  frameLoop: "demand"
}));

useSpringSync(api); // будет вызываться на каждом кадре из timeEngine
```

### 🌀 useFramerMotionSync

```ts
import { useFramerMotionSync } from "@stores/timeEngine";

const controls = useAnimation();
useFramerMotionSync(controls);
```

### 🧩 Регистрация произвольного renderCallback

```ts
useEffect(() => {
  const id = "my-debug-fps-logger";
  const dispose = timeEngine.registerRenderCallback(id, (fid, dt, elapsed) => {
    console.log(`[Frame ${fid}] dt=${dt.toFixed(2)}ms, t=${elapsed.toFixed(2)}ms`);
  });

  return () => dispose();
}, []);
```

---

## 🛠 Тестирование производительности

Можно временно включить:

```ts
console.log("Current FPS:", timeEngine.fps);
```

Или логировать `frameId`, `deltaTime`, `elapsedTime` прямо в `timeEngine._update()` для глубокой отладки.

---

## ❗ Частые ошибки

| Ошибка                                             | Причина                                                | Решение                          |
|----------------------------------------------------|--------------------------------------------------------|----------------------------------|
| `Cannot call advance when frameLoop is not demand` | `useSpring` без указания `frameLoop`                   | Добавь `frameLoop: "demand"`     |
| Зацикливание анимации                              | `raf.advance()` вызывается из нескольких мест          | Делегировать только `timeEngine` |
| Нет синхронизации фреймов                          | забыли вызвать `useSpringSync` / `useFramerMotionSync` | Добавить вызов хука              |

---

## 🎯 Вывод

🔹 Используй `AdaptiveTimeEngine` как **единый источник правды по времени**
🔹 Убедись, что **все анимации** настроены на `frameLoop: "demand"`
🔹 Используй `useSpringSync`, чтобы гарантировать ручной апдейт
🔹 Пусть `rafzCoordinator` работает как маршрутизатор фаз, а не таймер

---

Если тебе нужно — можно сделать расширенную версию с MobX/React DevTools integration, таймлайн-профайлером, или
хроматическими профилями 🚀
