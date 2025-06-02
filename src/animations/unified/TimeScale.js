import {makeAutoObservable, action, observable, computed} from "mobx";
import {useRef, useEffect} from "react";

import {useRef, useEffect} from 'react';
import timerStore from './TimerStore'; // Ваш экземпляр TimerStore

import {useState, useRef, useEffect} from 'react';
import timerStore from './TimerStore'; // Ваш экземпляр TimerStore

/**
 * Предоставляет актуальные данные времени из TimerStore.
 * @returns {{ frameId: number, deltaTime: number, elapsedTime: number }}
 */
const useTimerData = () => {
    const [timerData, setTimerData] = useState(() => ({ // Инициализация из текущих значений стора
        frameId: timerStore.frameId,
        deltaTime: 0, // Начальное значение, будет обновлено
        elapsedTime: timerStore.elapsedTime,
    }));

    const componentId = useRef(`timer-data-sync-${Math.random().toString(36).substring(2, 9)}`).current;

    useEffect(() => {
        // Сразу обновляем данные при монтировании, если таймер уже запущен
        // (на случай если первый тик уже прошел до регистрации колбэка)
        // Это может быть излишним, если TimerStore еще не запущен или frameId == 0.
        // setTimerData({
        //   frameId: timerStore.frameId,
        //   deltaTime: 0, // В первом кадре после монтирования сложно предсказать deltaTime
        //   elapsedTime: timerStore.elapsedTime,
        // });

        const callback = (frameId, scaledDeltaTime, elapsedTime) => {
            setTimerData({frameId, deltaTime: scaledDeltaTime, elapsedTime});
        };
        timerStore.registerRenderCallback(componentId, callback);
        return () => timerStore.unregisterRenderCallback(componentId);
    }, [componentId]); // Зависимость только componentId, чтобы зарегистрировать колбэк один раз

    return timerData;
};

export default useTimerData;


/**
 * Синхронизирует React Spring API с TimerStore.
 * @param {object | object[]} springApi - API контроллера React Spring или массив API.
 * @param {{ mode: 'non-vsync-only' | 'always' | 'never' }} [options] - Режим работы хука.
 */
const useSpringSync = (springApi, options = {mode: 'non-vsync-only'}) => {
    const componentId = useRef(`spring-sync-${Math.random().toString(36).substring(2, 9)}`).current;

    useEffect(() => {
        const apis = Array.isArray(springApi) ? springApi : [springApi];
        const validApis = apis.filter(api => api && typeof api.update === 'function');

        if (validApis.length === 0 && apis.length > 0) {
            // console.warn('useSpringSync: Предоставленные Spring API невалидны или не имеют метода update.');
            return;
        }
        if (validApis.length === 0) return;


        const callback = (frameId, scaledDeltaTime, elapsedTime) => {
            let shouldUpdate = false;
            if (options.mode === 'always') {
                shouldUpdate = true;
            } else if (options.mode === 'non-vsync-only' && !timerStore._vsyncEnabled) {
                shouldUpdate = true;
            }

            if (shouldUpdate) {
                validApis.forEach(api => api.update());
            }
            // scaledDeltaTime и elapsedTime также доступны здесь для передачи в логику анимации, если это необходимо.
        };

        timerStore.registerRenderCallback(componentId, callback);

        return () => {
            timerStore.unregisterRenderCallback(componentId);
        };
    }, [springApi, componentId, options.mode]); // springApi для отслеживания изменений в самом API
};

export default useSpringSync;


const useFramerMotionSync = (
    animationControls,
    options = {mode: "non-vsync-only"},
) => {
    const componentId = useRef(
        `framer-sync-${Math.random().toString(36).substring(2, 9)}`,
    ).current;

    useEffect(() => {
        if (!animationControls || typeof animationControls.update !== "function") {
            // console.warn('useFramerMotionSync: animationControls не предоставлены или не имеют метода update.');
            return;
        }

        const callback = (frameId, scaledDeltaTime, elapsedTime) => {
            let shouldUpdate = false;
            if (options.mode === "always") {
                shouldUpdate = true;
            } else if (
                options.mode === "non-vsync-only" &&
                !timerStore._vsyncEnabled
            ) {
                shouldUpdate = true;
            }

            if (shouldUpdate) {
                animationControls.update();
            }
            // Здесь scaledDeltaTime и elapsedTime доступны, если анимация должна их использовать напрямую.
            // Например: animationControls.start({ customValue: elapsedTime });
        };

        timerStore.registerRenderCallback(componentId, callback);

        return () => {
            timerStore.unregisterRenderCallback(componentId);
        };
    }, [animationControls, componentId, options.mode]); // timerStore._vsyncEnabled не в зависимостях, т.к. колбэк сам проверяет его актуальное значение
};

class TimerScale {
    // Наблюдаемые значения
    @observable elapsedTime = 0; // в миллисекундах, теперь это "виртуальное" или "анимационное" время
    @observable isRunning = false;
    @observable precision = 100; // Как обсуждали, его использование нужно уточнить или интегрировать. Пока оставляем.
    @observable fps = 0;
    @observable targetFps = 60;
    @observable frameId = 0;
    @observable timeScale = 1.0; // 1.0 = нормальная скорость

    // FPS счетчик
    frameCount = 0;
    lastFpsUpdateTime = 0;
    fpsUpdateInterval = 1000; // Обновлять FPS каждую секунду

    // Управление рендерингом
    renderCallbacks = new Map();

    // Приватные поля
    _startTime = 0; // Реальное время старта таймера (или последнего reset)
    _timerId = null;
    _lastFrameTime = 0; // Реальное время последнего кадра
    _frameTimings = []; // Хранит реальное время между кадрами для расчета FPS
    _nextFrameCallbacks = [];
    _vsyncEnabled = true;
    @observable currentDetailLevel = 2; // Пример: 0 (низкий), 1 (средний), 2 (высокий). Начинаем с высокого.
    @observable userLockedDetailLevel = null;
    _optimizerConfig = {
        // Пороги FPS для каждого уровня. FPS ниже -> понижение, FPS выше -> повышение.
        // { level: ..., downgradeFps: ..., upgradeFps: ... (null если нельзя повысить/понизить) }
        levels: [
            {id: 0, name: "Низкий", downgradeFps: null, upgradeFps: 55}, // С низкого можно только повысить
            {id: 1, name: "Средний", downgradeFps: 40, upgradeFps: 80},
            {id: 2, name: "Высокий", downgradeFps: 50, upgradeFps: null}, // С высокого можно только понизить
        ],
        checkInterval: 5000, // Как часто проверять производительность (мс)
        trendSamples: 5, // Сколько последовательных показаний FPS нужно для подтверждения тренда
        cooldownPeriod: 10000, // Минимальное время между автоматическими изменениями уровня (мс)
    };

    _optimizerState = {
        lastCheckTime: 0,
        lastChangeTime: 0,
        fpsTrend: [], // Хранит последние `trendSamples` значений FPS
    };

    constructor() {
        makeAutoObservable(this, {
            elapsedTime: observable,
            isRunning: observable,
            precision: observable,
            fps: observable,
            targetFps: observable,
            frameId: observable,
            timeScale: observable,
            averageFrameTime: computed,
            minFps: computed,
            maxFps: computed,
            performanceStats: computed,
            seconds: computed,
            formattedTime: computed,
            start: action,
            stop: action,
            reset: action,
            setPrecision: action, // Если будете использовать
            setTargetFps: action,
            setTimeScale: action, // Новый метод
            registerRenderCallback: action,
            unregisterRenderCallback: action,
            nextFrame: action,
            enableVSync: action,
            disableVSync: action,
            _tick: action,
            _updateFps: action,
            _limitFrameRate: action,
            // currentDetailLevel: observable,
            // userLockedDetailLevel: observable,
            // _evaluatePerformance: action, // Назовем его так
            // setDetailLevel: action, // Для установки уровня (внутренний, будет вызван evaluatePerformance)
            // lockDetailLevel: action,
            // unlockDetailLevel: action,
        });
    }


    setTimeScale(scale) {
        if (scale < 0) scale = 0; // Отрицательная скорость обычно не нужна
        this.timeScale = scale;
        // Перезапускать таймер не нужно, _tick будет использовать новое значение timeScale
        return this;
    }


    start() {
        if (this.isRunning) return this;
        this.isRunning = true;

        // _startTime используется для отсчета общего реального времени, если это необходимо.
        // Для elapsedTime, которое накапливается, важно правильно установить _lastFrameTime.
        this._startTime = Date.now(); // Обновляем _startTime при каждом запуске после остановки или при первом запуске
        this._lastFrameTime = Date.now(); // Ключевой момент для корректного deltaTime в первом _tick
        this.lastFpsUpdateTime = Date.now(); // Для расчета FPS

        if (this._vsyncEnabled) {
            const frameCallback = () => {
                if (!this.isRunning) return;
                this._tick();
                // Проверяем isRunning снова, так как _tick или колбэк могли остановить таймер
                if (this.isRunning) {
                    this._timerId = requestAnimationFrame(frameCallback);
                }
            };
            this._timerId = requestAnimationFrame(frameCallback);
        } else {
            const interval = 1000 / this.targetFps;
            this._timerId = setInterval(() => {
                if (!this.isRunning) {
                    // Дополнительная проверка, если таймер был остановлен асинхронно
                    if (this._timerId) clearInterval(this._timerId);
                    this._timerId = null;
                    return;
                }
                this._tick();
            }, interval);
        }
        return this;
    }


    stop() {
        if (!this.isRunning) return this;
        this.isRunning = false;
        if (this._vsyncEnabled) {
            if (this._timerId) cancelAnimationFrame(this._timerId);
        } else {
            if (this._timerId) clearInterval(this._timerId);
        }
        this._timerId = null;
        // this._frameTimings = []; // Очистка здесь может быть нежелательна, если нужна статистика при паузе.
        // В вашем коде это было, так что если это требование, оставьте.
        // Для целей "паузы" лучше не очищать. Для "полной остановки" - можно.
        return this;
    }


    reset() {
        this.stop();
        this.elapsedTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.frameId = 0;
        this._frameTimings = [];
        this._nextFrameCallbacks = [];
        this.timeScale = 1.0; // Сбрасываем timeScale к значению по умолчанию
        // _startTime и _lastFrameTime будут установлены при следующем вызове start()
        return this;
    }


    _tick() {
        if (!this.isRunning) return;

        const now = Date.now();

        // В режиме без VSync проверяем, нужно ли пропустить кадр
        if (!this._vsyncEnabled && !this._limitFrameRate(this.targetFps)) {
            return;
        }

        // Рассчитываем реальное прошедшее время с последнего кадра
        const actualDeltaTime = now - this._lastFrameTime;

        // Ограничиваем максимальное значение actualDeltaTime, чтобы избежать "прыжков"
        // после длительной паузы (например, если вкладка была неактивна).
        // Максимум в 3 раза больше времени одного кадра при targetFps, или просто фиксированное значение (например, 250-500мс).
        const maxDeltaTime = this._vsyncEnabled
            ? 1000 / 15
            : (1000 / this.targetFps) * 3; // ~66ms для 15fps или 3х кадра
        const clampedActualDeltaTime = Math.min(actualDeltaTime, maxDeltaTime);

        // Масштабируем deltaTime с учетом timeScale
        const scaledDeltaTime = clampedActualDeltaTime * this.timeScale;

        // Накапливаем "виртуальное" время
        this.elapsedTime += scaledDeltaTime;
        this._lastFrameTime = now; // Обновляем время последнего кадра (реальное)

        this.frameCount++;
        this.frameId++;

        // Сохраняем реальное время кадра для расчета FPS
        this._frameTimings.push(clampedActualDeltaTime); // Используем clamped для более стабильных расчетов FPS
        if (this._frameTimings.length > 60) {
            // Хранить данные для последних 60 кадров
            this._frameTimings.shift();
        }

        // Обновляем FPS
        if (now - this.lastFpsUpdateTime >= this.fpsUpdateInterval) {
            this._updateFps(now); // Передаем 'now' для точности
        }

        // Выполняем все зарегистрированные колбэки рендеринга
        this.renderCallbacks.forEach((callback, id) => {
            try {
                // Передаем frameId, МАСШТАБИРОВАННОЕ deltaTime и МАСШТАБИРОВАННОЕ elapsedTime
                callback(this.frameId, scaledDeltaTime, this.elapsedTime);
            } catch (e) {
                console.error(`Error in render callback (id: ${id}):`, e);
            }
        });

        // Выполняем одноразовые колбэки
        const nextFrameCallbacks = [...this._nextFrameCallbacks];
        this._nextFrameCallbacks = [];
        nextFrameCallbacks.forEach((callback) => {
            try {
                callback(this.frameId, scaledDeltaTime, this.elapsedTime);
            } catch (e) {
                console.error("Error in next frame callback:", e);
            }
        });
    }


    _updateFps(currentTime) {
        // Принимаем currentTime для большей точности
        const elapsedSinceLastUpdate = currentTime - this.lastFpsUpdateTime;

        if (elapsedSinceLastUpdate > 0) {
            this.fps = Math.round((this.frameCount * 1000) / elapsedSinceLastUpdate);
            this.frameCount = 0;
            this.lastFpsUpdateTime = currentTime;
        }
    }


    lockDetailLevel(level) {
        const targetLevel = this._optimizerConfig.levels.find(
            (l) => l.id === level,
        );
        if (targetLevel) {
            this.userLockedDetailLevel = targetLevel.id;
            this._setDetailLevelInternal(targetLevel.id, true); // true = принудительная установка
            console.log(
                `Уровень детализации ЗАБЛОКИРОВАН пользователем: ${targetLevel.name}`,
            );
        }
        return this;
    }


    unlockDetailLevel() {
        if (this.userLockedDetailLevel !== null) {
            this.userLockedDetailLevel = null;
            this._optimizerState.lastChangeTime = Date.now(); // Даем время после разблокировки перед авто-изменением
            console.log(
                "Уровень детализации РАЗБЛОКИРОВАН. Авто-оптимизатор активен.",
            );
        }
        return this;
    }

    // Вызывается из _updateFps или по отдельному таймеру

    _evaluatePerformance() {
        if (this.userLockedDetailLevel !== null) return; // Не работаем, если уровень заблокирован

        const now = Date.now();
        if (
            now - this._optimizerState.lastCheckTime <
            this._optimizerConfig.checkInterval
        ) {
            return; // Еще не время для проверки
        }
        this._optimizerState.lastCheckTime = now;

        if (
            now - this._optimizerState.lastChangeTime <
            this._optimizerConfig.cooldownPeriod
        ) {
            return; // В периоде "остывания" после последнего изменения
        }

        // Используем текущий усредненный FPS
        const currentFps = this.fps;
        this._optimizerState.fpsTrend.push(currentFps);
        if (
            this._optimizerState.fpsTrend.length > this._optimizerConfig.trendSamples
        ) {
            this._optimizerState.fpsTrend.shift();
        }

        // Нужно достаточно данных для тренда
        if (
            this._optimizerState.fpsTrend.length < this._optimizerConfig.trendSamples
        ) {
            return;
        }

        const avgTrendFps =
            this._optimizerState.fpsTrend.reduce((a, b) => a + b, 0) /
            this._optimizerState.fpsTrend.length;
        const currentLevelSettings =
            this._optimizerConfig.levels[this.currentDetailLevel];

        // Логика понижения уровня
        if (
            currentLevelSettings.downgradeFps !== null &&
            avgTrendFps < currentLevelSettings.downgradeFps
        ) {
            if (this.currentDetailLevel > 0) {
                // Убедимся, что есть куда понижать
                this._setDetailLevelInternal(this.currentDetailLevel - 1);
                return; // Выходим после изменения
            }
        }
        // Логика повышения уровня
        else if (
            currentLevelSettings.upgradeFps !== null &&
            avgTrendFps > currentLevelSettings.upgradeFps
        ) {
            if (this.currentDetailLevel < this._optimizerConfig.levels.length - 1) {
                // Убедимся, что есть куда повышать
                this._setDetailLevelInternal(this.currentDetailLevel + 1);
                return; // Выходим после изменения
            }
        }
    }

    // Внутренний метод для изменения уровня детализации

    _setDetailLevelInternal(newLevelId, force = false) {
        if (newLevelId === this.currentDetailLevel && !force) return;

        const newLevelSettings = this._optimizerConfig.levels.find(
            (l) => l.id === newLevelId,
        );
        if (!newLevelSettings) return; // Некорректный ID уровня

        console.log(
            `Автооптимизатор: Изменение уровня детализации с ${this.currentDetailLevel} (${this._optimizerConfig.levels[this.currentDetailLevel]?.name}) на ${newLevelId} (${newLevelSettings.name}). Текущий FPS: ${this.fps.toFixed(1)}`,
        );
        this.currentDetailLevel = newLevelId;

        if (!force) {
            // Если это автоматическое изменение
            this._optimizerState.lastChangeTime = Date.now();
            this._optimizerState.fpsTrend = []; // Сбрасываем тренд после изменения
        }
    }

    // В _updateFps нужно добавить вызов _evaluatePerformance:
    // 
    // _updateFps(currentTime) {
    //   ... (расчет fps)
    //   this._evaluatePerformance(); // Вызываем после обновления FPS
    // }
    // ... (остальные геттеры и методы: averageFrameTime, minFps, maxFps, etc.)
    // Убедитесь, что averageFrameTime, minFps, maxFps используют _frameTimings,
    // которые содержат реальное (clampedActualDeltaTime), а не масштабированное время кадра.
    // Это важно, так как FPS должен отражать реальную производительность системы.
    // Ваш текущий код для этих computed-свойств уже делает это правильно.

    // setPrecision, setTargetFps, enableVSync, disableVSync, registerRenderCallback,
    // unregisterRenderCallback, nextFrame, get seconds, get formattedTime,
    // averageFrameTime, minFps, maxFps, performanceStats - остаются как есть,
    // если их логика не конфликтует с изменениями (вроде бы нет).
}

const timeScale = new TimerScale();
export default timeScale;


// import { motion } from 'motion/react';
// import useTimerData from './useTimerData';
//
// const CustomMovingBlock = () => {
//   const { elapsedTime } = useTimerData();
//
//   // Пример: двигаем блок по синусоиде в зависимости от elapsedTime
//   const xOffset = Math.sin(elapsedTime / 500) * 100; // Движение на 100px влево-вправо
//
//   return (
//       <motion.div
//           style={{
//             width: 50,
//             height: 50,
//             borderRadius: '50%',
//             backgroundColor: 'orange',
//             x: xOffset, // Используем вычисленное значение
//           }}
//       />
//   );
// };


// import { observer } from 'mobx-react-lite';
// import { useSpring, animated, config } from '@react-spring/web';
// import timerStore from './TimerStore';
// import useSpringSync from './useSpringSync'; // Улучшенный хук
//
// const SmartSpringAnimation = observer(() => {
//   const detailLevel = timerStore.currentDetailLevel;
//
//   const [styles, api] = useSpring(() => ({
//     from: { opacity: 0, scale: 0.5 },
//     opacity: 1,
//     scale: 1,
//     config: detailLevel === 2 ? config.wobbly : config.gentle, // Разная конфигурация для разных уровней
//   }));
//
//   // Синхронизируем, если TimerStore в режиме non-VSync или если хотим всегда
//   useSpringSync(api, { mode: 'non-vsync-only' });
//
//   useEffect(() => {
//     // Перезапускаем анимацию с новой конфигурацией, если уровень детализации изменился
//     api.start({
//       reset: true, // Сбросить к from значениям
//       from: { opacity: 0, scale: 0.5 },
//       to: { opacity: 1, scale: 1 },
//       config: detailLevel === 2 ? config.wobbly : config.stiff,
//     });
//   }, [detailLevel, api]);
//
//   if (detailLevel === 0) { // На низком уровне детализации не показываем эту анимацию
//     return <div style={{height: 50}}>Анимация отключена (низкий уровень детализации)</div>;
//   }
//
//   return (
//       <animated.div style={{ ...styles, width: 100, height: 50, background: 'lightblue', margin: 10 }}>
//         Уровень: {detailLevel}
//       </animated.div>
//   );
// });
//
// export default SmartSpringAnimation;
